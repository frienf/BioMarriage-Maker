'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AlertIcon, Tick } from '@/components/toran';

export type OrderStatus = {
  status: 'awaiting_payment' | 'paid' | 'failed' | 'refunded';
  pdfStatus: 'none' | 'rendering' | 'ready' | 'failed';
  orderNumber: string;
  downloadsUsed: number;
  downloadLimit: number;
  editsUsed: number;
  editLimit: number;
  expiresAt: string | null;
  deleted: boolean;
};

/**
 * The order page.
 *
 * It never claims success before the server says so: while a payment settles it
 * polls, and it asks people not to pay again, which is the moment a confused
 * customer double-charges themselves.
 */
/** The three order states are mutually exclusive, so they share one arrival. */
const STATE_SWAP = {
  initial: { opacity: 0, y: motionTokens.distance.sm },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -motionTokens.distance.sm }
} as const;

export function OrderPanel({ token, initial }: { token: string; initial: OrderStatus }) {
  const t = useTranslations('order');
  const [state, setState] = useState(initial);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/orders/${token}`, { cache: 'no-store' });
    if (res.ok) setState((await res.json()) as OrderStatus);
  }, [token]);

  // Poll only while there is something to wait for.
  useEffect(() => {
    if (state.status !== 'awaiting_payment' || state.deleted) return;
    const id = window.setInterval(refresh, 4000);
    return () => window.clearInterval(id);
  }, [state.status, state.deleted, refresh]);

  if (state.deleted) {
    return (
      <motion.div className="note" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Tick />
        {t('deleted')}
      </motion.div>
    );
  }

  const until = state.expiresAt ? new Date(state.expiresAt).toLocaleDateString() : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AnimatePresence mode="wait" initial={false}>
      {state.status === 'awaiting_payment' ? (
        <motion.section
          key="pending"
          layout
          {...STATE_SWAP}
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <h2 className="display" style={{ fontSize: 'var(--text-h2-sm)' }}>
            {t('pendingTitle')}
          </h2>
          <p className="muted">{t('pendingBody')}</p>
          <p
            aria-live="polite"
            className="xsmall muted"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: 'var(--marigold)',
                display: 'inline-block'
              }}
            />
            {t('orderNumber')}: {state.orderNumber}
          </p>
        </motion.section>
      ) : null}

      {state.status === 'paid' ? (
        <motion.section
          key="paid"
          layout
          {...STATE_SWAP}
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <h2 className="display" style={{ fontSize: 'var(--text-h2-sm)' }}>
            {t('readyTitle')}
          </h2>
          <p className="muted">
            {t('readyBody', { used: state.downloadsUsed, limit: state.downloadLimit, until })}
          </p>
          <a
            className="btn btn-primary btn-lg"
            href={`/api/download/${token}`}
            style={{ alignSelf: 'start' }}
            onClick={() => {
              setDownloading(true);
              setError('');
              // The first download renders the PDF, which takes a few seconds.
              window.setTimeout(() => {
                setDownloading(false);
                void refresh();
              }, 6000);
            }}
          >
            {downloading ? '…' : t('download')}
          </a>
          <p className="xsmall muted">
            {t('orderNumber')}: {state.orderNumber} · {t('edits', { left: state.editLimit - state.editsUsed, total: state.editLimit })}
          </p>
          {error ? (
            <p className="error">
              <AlertIcon />
              {error}
            </p>
          ) : null}
        </motion.section>
      ) : null}

      {state.status === 'failed' ? (
        <motion.section
          key="failed"
          layout
          {...STATE_SWAP}
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <h2 className="display" style={{ fontSize: 'var(--text-h2-sm)' }}>
            {t('failedTitle')}
          </h2>
          <p className="muted">{t('failedBody')}</p>
          <Link href="/review" className="btn btn-outline-brand" style={{ alignSelf: 'start' }}>
            {t('retry')}
          </Link>
        </motion.section>
      ) : null}
      </AnimatePresence>

      <section className="note" style={{ flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
        <strong>{t('keepLink')}</strong>
        <span>{t('keepLinkBody')}</span>
        <button
          type="button"
          className="btn btn-outline-brand"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 3000);
            } catch {
              setError('Copy the address from the address bar.');
            }
          }}
        >
          {copied ? t('copied') : t('copyLink')}
        </button>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>{t('deleteTitle')}</h2>
        <p className="muted small">{t('deleteBody')}</p>
        <button
          type="button"
          className="btn btn-outline"
          style={{ alignSelf: 'start', color: 'var(--danger)', borderColor: 'var(--danger)' }}
          onClick={async () => {
            if (!window.confirm(t('deleteConfirm'))) return;
            const res = await fetch(`/api/orders/${token}`, { method: 'DELETE' });
            if (res.ok) setState({ ...state, deleted: true });
            else setError('That could not be deleted. Write to support.');
          }}
        >
          {t('delete')}
        </button>
      </section>
    </div>
  );
}
