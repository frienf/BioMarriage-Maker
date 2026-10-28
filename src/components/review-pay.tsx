'use client';

import Script from 'next/script';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import type { Biodata } from '@/lib/biodata';
import { checkBiodata } from '@/lib/biodata';
import { loadDraft } from '@/lib/draft';
import { templateBySlug } from '@/templates/catalog';
import { A4, ScaledSheet, TemplateSheet } from '@/templates/render';
import { formatINR } from '@/lib/money';
import { AlertIcon, LockIcon } from '@/components/toran';

type Checkout = new (options: Record<string, unknown>) => { open: () => void };
declare global {
  interface Window {
    Razorpay?: Checkout;
  }
}

const LANG = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' } as const;

export function ReviewPay() {
  const t = useTranslations('review');
  const tc = useTranslations('common');
  const te = useTranslations('editor');
  const router = useRouter();
  const [data, setData] = useState<Biodata | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [scriptReady, setScriptReady] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => setData(loadDraft()), []);

  // A fixed A4 sheet clips what does not fit, and a clipped biodata loses
  // somebody's contact details silently. Measure, and refuse to sell it.
  useEffect(() => {
    const el = sheetRef.current?.querySelector('article');
    setOverflows(el ? el.scrollHeight > A4.h + 2 : false);
  }, [data]);

  const def = data ? templateBySlug(data.templateSlug) : undefined;
  const issues = useMemo(() => (data ? checkBiodata(data) : []), [data]);

  async function pay() {
    if (!data || !def || busy) return;
    setBusy(true);
    setFailure('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ biodata: data })
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created?.error ?? 'Could not start the payment.');

      if (!window.Razorpay) throw new Error('The payment window could not load. Check your connection and try again.');

      const checkout = new window.Razorpay({
        key: created.keyId,
        amount: created.amount,
        currency: 'INR',
        name: 'Biodata Maker',
        description: `${def.title} biodata`,
        order_id: created.razorpayOrderId,
        // Never show success before the server has verified the signature.
        handler: async (response: Record<string, string>) => {
          await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ token: created.token, ...response })
          });
          router.push(`/orders/${created.token}`);
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            // The order exists and is unpaid; its page explains what to do.
            router.push(`/orders/${created.token}`);
          }
        },
        theme: { color: '#0E3B3A' }
      });
      checkout.open();
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Something went wrong.');
      setBusy(false);
    }
  }

  if (data === null) {
    return (
      <main id="main" className="shell band">
        <p className="muted">{tc('loading')}</p>
      </main>
    );
  }

  if (!def) {
    return (
      <main id="main" className="shell band" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 className="page-title">{tc('notFoundTitle')}</h1>
        <p className="lede">{tc('notFoundBody')}</p>
        <Link href="/templates" className="btn btn-primary" style={{ alignSelf: 'start' }}>
          {tc('backHome')}
        </Link>
      </main>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setScriptReady(true)} strategy="afterInteractive" />
      <main id="main" className="shell" style={{ paddingTop: 40, paddingBottom: 80, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 className="page-title">{t('title')}</h1>
          <p className="lede">{t('lede')}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
          <div
            style={{
              flex: '1 1 460px',
              minWidth: 0,
              display: 'flex',
              justifyContent: 'center',
              padding: '32px 16px',
              borderRadius: 'var(--r-panel)',
              background: 'var(--canvas)'
            }}
          >
            <div ref={sheetRef}>
              <ScaledSheet width={420} shadow watermark={tc('previewStamp')}>
                <TemplateSheet data={data} accent={def.accent} instanceId="review" />
              </ScaledSheet>
            </div>
          </div>

          <div style={{ flex: '1 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {issues.length ? (
              <div className="note note-danger" style={{ flexDirection: 'column', gap: 8 }}>
                <strong>{t('issuesTitle')}</strong>
                {issues.map((i) => (
                  <span key={i.field + i.message} style={{ display: 'flex', gap: 8 }}>
                    <AlertIcon />
                    {i.message}
                  </span>
                ))}
                <Link href="/editor" style={{ fontWeight: 600 }}>
                  {t('editAgain')}
                </Link>
              </div>
            ) : null}

            <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>{t('summary')}</h2>
              <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
                {[
                  [t('templateRow'), def.title],
                  [t('languageRow'), LANG[data.docLocale]],
                  [t('pagesRow'), String(def.pages)],
                  [t('priceRow'), formatINR(def.pricePaise)]
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt className="muted">{k}</dt>
                    <dd style={{ margin: 0, fontWeight: 600 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <label className="radio-card" style={{ alignItems: 'flex-start', paddingBlock: 12, minHeight: 'auto' }}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 4 }} />
              <span className="small">{t('consent')}</span>
            </label>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={!consent || busy || issues.length > 0 || overflows || !scriptReady}
              onClick={pay}
            >
              {busy ? t('sending') : t('pay', { price: formatINR(def.pricePaise) })}
            </button>

            {overflows ? (
              <p className="note note-danger">
                <AlertIcon />
                {te('mayOverflow')}
              </p>
            ) : null}

            {failure ? (
              <p className="note note-danger">
                <AlertIcon />
                {failure}
              </p>
            ) : null}

            <p className="note">
              <LockIcon />
              {t('payNote')}
            </p>

            <Link href="/editor" style={{ fontWeight: 600 }}>
              {t('editAgain')}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
