import { NextResponse } from 'next/server';
import { biodataSchema, checkBiodata } from '@/lib/biodata';
import { unsupportedIn } from '@/lib/glyphs';
import { createOrder, attachRazorpayOrder } from '@/lib/orders';
import { createRazorpayOrder, publicKeyId } from '@/lib/razorpay';

export const runtime = 'nodejs';

/**
 * The first moment a biodata reaches the server. Everything before this
 * happened in the visitor's browser, which is what the privacy page promises.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send JSON.' }, { status: 400 });
  }

  const payload = body as { biodata?: unknown; accent?: unknown };
  const parsed = biodataSchema.safeParse(payload.biodata);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Those details are incomplete.', issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // The same two gates the editor applies, applied again here. The editor runs
  // on the visitor's machine, so it is a convenience, not a control.
  const issues = checkBiodata(data);
  if (issues.length) return NextResponse.json({ error: 'Those details cannot be published yet.', issues }, { status: 400 });

  const { photo: _photo, ...text } = data;
  const bad = unsupportedIn(text);
  if (bad.length) {
    return NextResponse.json(
      { error: `These characters would print as empty boxes: ${bad.join(' ')}`, issues: [{ field: 'fullName', message: bad.join(' ') }] },
      { status: 400 }
    );
  }

  const accent = typeof payload.accent === 'string' && /^#[0-9a-fA-F]{6}$/.test(payload.accent) ? payload.accent : null;

  try {
    const order = await createOrder(data, accent);
    const rzp = await createRazorpayOrder(order.pricePaise, order.orderNumber);
    await attachRazorpayOrder(order.token, rzp.id);
    return NextResponse.json({
      token: order.token,
      orderNumber: order.orderNumber,
      amount: order.pricePaise,
      razorpayOrderId: rzp.id,
      keyId: publicKeyId()
    });
  } catch (err) {
    console.error('order create failed', err);
    return NextResponse.json({ error: 'We could not start the payment. Try again.' }, { status: 502 });
  }
}
