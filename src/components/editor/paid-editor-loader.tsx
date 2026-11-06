'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { biodataSchema, type Biodata } from '@/lib/biodata';
import { Editor } from './editor';

export type PaidEdit = { token: string; biodata: Biodata; templateSlug: string; pricePaise: number; editsUsed: number; editLimit: number };

export function PaidEditorLoader({ token }: { token: string }) {
  const t = useTranslations('order');
  const [state, setState] = useState<'loading' | 'unavailable' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [paid, setPaid] = useState<PaidEdit | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    fetch(`/api/orders/${encodeURIComponent(token)}/edit`, { cache: 'no-store', signal: controller.signal })
      .then(async (res) => {
        if (res.status === 404) { setState('unavailable'); return; }
        if (!res.ok) throw new Error();
        const body = await res.json();
        const biodata = biodataSchema.safeParse(body.biodata);
        if (!biodata.success || typeof body.templateSlug !== 'string' || typeof body.pricePaise !== 'number' ||
            typeof body.editsUsed !== 'number' || typeof body.editLimit !== 'number') throw new Error();
        setPaid({ token, biodata: biodata.data, templateSlug: body.templateSlug, pricePaise: body.pricePaise, editsUsed: body.editsUsed, editLimit: body.editLimit });
      }).catch(() => { if (!controller.signal.aborted) setState('error'); });
    return () => controller.abort();
  }, [token, attempt]);

  if (paid) return <Editor initialSlug={paid.templateSlug} useSample={false} paid={paid} />;
  return <main id="main" className="shell band" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <h1 className="page-title">{t('editAction')}</h1>
    <p role={state === 'loading' ? 'status' : 'alert'}>{t(state === 'loading' ? 'editLoading' : state === 'unavailable' ? 'editUnavailable' : 'editLoadError')}</p>
    {state === 'error' && <button className="btn btn-outline-brand" style={{ alignSelf: 'start' }} onClick={() => setAttempt((n) => n + 1)}>{t('retry')}</button>}
    <Link href={`/orders/${token}`} className="btn btn-outline" style={{ alignSelf: 'start' }}>{t('editBack')}</Link>
  </main>;
}
