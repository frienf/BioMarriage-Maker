import { NextResponse } from 'next/server';
import { biodataSchema, checkBiodata } from '@/lib/biodata';
import { unsupportedIn } from '@/lib/glyphs';
import { createOrder, attachRazorpayOrder } from '@/lib/orders';
import { createRazorpayOrder, publicKeyId } from '@/lib/razorpay';
import { validPhoto } from '@/lib/photo-validation';
import { readEditBody } from '@/lib/order-edits';

export const runtime = 'nodejs';

/**
 * The first moment a biodata reaches the server. Everything before this
 * happened in the visitor's browser, which is what the privacy page promises.
 */
export async function POST(request: Request) {
  const input = await readEditBody(request.body);
  if (input.kind === 'too-large') return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  if (input.kind === 'invalid' || !input.body || typeof input.body !== 'object' || Array.isArray(input.body)) {
    return NextResponse.json({ error: 'Send JSON.' }, { status: 400 });
  }

  const payload = input.body as { biodata?: unknown; accent?: unknown };
  const parsed = biodataSchema.safeParse(payload.biodata);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Those details are incomplete.', issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (!(await validPhoto(data.photo.src))) {
    return NextResponse.json({ error: 'Choose a valid JPEG, PNG or WebP photo.' }, { status: 400 });
  }

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
