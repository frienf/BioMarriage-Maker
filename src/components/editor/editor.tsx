'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import type { Biodata, DocLocale } from '@/lib/biodata';
import { biodataSchema, checkBiodata, emptyBiodata } from '@/lib/biodata';
import { unsupportedIn } from '@/lib/glyphs';
import { clearDraft, loadDraft, saveDraft } from '@/lib/draft';
import { TEMPLATES, templateBySlug } from '@/templates/catalog';
import { A4, ScaledSheet, TemplateSheet } from '@/templates/render';
import { sampleFor } from '@/templates/sample';
import { formatINR } from '@/lib/money';
import { AlertIcon, LockIcon, Tick } from '@/components/toran';
import { StepAbout, StepContact, StepFamily, StepHoroscope, StepPersonal, StepWork, PhotoStep } from './steps';
import { allowedTemplate, overflowingPages } from '@/lib/paid-editor';
import type { PaidEdit } from './paid-editor-loader';
import { createEditHistoryGuard } from '@/lib/edit-history';

const STEP_KEYS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'] as const;

/** A short slide in the direction of travel. `custom` carries +1 forward,
 *  -1 back, so going back does not look like going on. */
const STEP_SLIDE = {
  enter: (d: number) => ({ opacity: 0, x: d * motionTokens.distance.md }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -motionTokens.distance.md })
};

export function Editor({ initialSlug, useSample, paid }: { initialSlug: string; useSample: boolean; paid?: PaidEdit }) {
  const t = useTranslations('editor');
  const locale = useLocale();
  const to = useTranslations('order');
  const tg = useTranslations('gallery');
  const tc = useTranslations('common');
  const router = useRouter();
  const [data, setData] = useState<Biodata>(() => paid?.biodata ?? emptyBiodata(initialSlug, 'en'));
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [overflowPages, setOverflowPages] = useState<number[] | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoPending, setPhotoPendingState] = useState(false);
  const [saveError, setSaveError] = useState('');
  const sheetRef = useRef<HTMLDivElement>(null);
  const def = templateBySlug(data.templateSlug) ?? TEMPLATES[0];
  const dirty = !!paid && (photoPending || JSON.stringify(data) !== JSON.stringify(paid.biodata));
  const isPaid = !!paid;
  const dirtyRef = useRef(dirty);
  const confirmRef = useRef(to);
  const historyGuard = useRef<ReturnType<typeof createEditHistoryGuard> | null>(null);
  const confirmedLeave = useRef(false);
  const savingRef = useRef(false);
  const savedRef = useRef(false);
  const photoPendingRef = useRef(false);
  dirtyRef.current = dirty;
  confirmRef.current = to;

  // Load the draft on the client only: the server has never seen it.
  useEffect(() => {
    if (paid) { setHydrated(true); return; }
    const saved = loadDraft();
    if (saved) setData({ ...saved, templateSlug: initialSlug || saved.templateSlug });
    else if (useSample) setData({ ...sampleFor(initialSlug, 'en'), templateSlug: initialSlug });
    setHydrated(true);
  }, [initialSlug, useSample, paid]);

  // Autosave, debounced: a keystroke should not hit storage.
  useEffect(() => {
    if (!hydrated || paid) return;
    const id = window.setTimeout(() => setStorageOk(saveDraft(data)), 500);
    return () => window.clearTimeout(id);
  }, [data, hydrated, paid]);

  useEffect(() => {
    if (!isPaid) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (confirmedLeave.current || savedRef.current || (!dirtyRef.current && !savingRef.current && !photoPendingRef.current)) return;
      event.preventDefault(); event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [isPaid]);

  // A single sentinel remains armed across dirty/clean transitions.
  useEffect(() => {
    if (!isPaid) return;
    const guard = createEditHistoryGuard({
      dirty: () => !savedRef.current && (dirtyRef.current || savingRef.current || photoPendingRef.current),
      busy: () => savingRef.current && !savedRef.current,
      confirm: () => window.confirm(confirmRef.current('editUnsaved')),
      push: () => window.history.pushState(window.history.state, '', window.location.href),
      back: () => window.history.back(),
      leave: () => {
        const destination = new URL(window.location.href);
        destination.pathname = destination.pathname.replace(/\/edit\/?$/, '');
        destination.search = '';
        destination.hash = '';
        confirmedLeave.current = true;
        // If navigation is blocked, do not suppress later unload warnings.
        window.setTimeout(() => { confirmedLeave.current = false; }, 1000);
        window.location.replace(destination.href);
      },
      forward: () => window.history.forward(),
      location: () => window.location.href
    });
    historyGuard.current = guard;
    const onPop = (event: PopStateEvent) => guard.pop(event);
    const onHash = () => guard.syncLocation();
    window.addEventListener('popstate', onPop, true);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('popstate', onPop, true);
      window.removeEventListener('hashchange', onHash);
      historyGuard.current = null;
    };
  }, [isPaid]);

  useEffect(() => { historyGuard.current?.arm(); }, [data, dirty, isPaid]);

  const measurePages = useCallback(() => {
    if (!sheetRef.current || document.fonts.status !== 'loaded') return null;
    return overflowingPages(sheetRef.current.querySelectorAll('article'), def.pages, A4.h);
  }, [def.pages]);

  useEffect(() => {
    const measure = () => setOverflowPages(measurePages());
    measure();
    document.fonts.addEventListener('loading', measure);
    document.fonts.addEventListener('loadingdone', measure);
    return () => {
      document.fonts.removeEventListener('loading', measure);
      document.fonts.removeEventListener('loadingdone', measure);
    };
  }, [data, measurePages]);

  const set = useCallback((patch: Partial<Biodata>) => setData((d) => ({ ...d, ...patch })), []);
  const setPhotoPending = useCallback((pending: boolean) => {
    photoPendingRef.current = pending;
    setPhotoPendingState(pending);
    if (pending) historyGuard.current?.arm();
  }, []);
  const setPhoto = useCallback((patch: Partial<Biodata>) => {
    if (!savingRef.current) set(patch);
  }, [set]);

  const badGlyphs = useMemo(() => {
    const { photo: _photo, ...text } = data;
    return unsupportedIn(text);
  }, [data]);

  const issues = useMemo(() => {
    if (!showErrors) return [];
    const issues = checkBiodata(data);
    if (!paid) return issues;
    const parsed = biodataSchema.safeParse(data);
    const fields = [...issues.map((i) => i.field), ...(parsed.success ? [] : parsed.error.issues.map((i) => i.path.map(String).join('.')) )];
    return [...new Set(fields)].map((field) => ({ field, message: to(field === 'fullName' ? 'editFieldName' : field === 'dob' ? 'editFieldDob' : field === 'phone' || field === 'email' || field === 'altPhone' ? 'editFieldPhone' : /^education\.\d+\.year$/.test(field) ? 'editFieldYear' : 'editFieldOther') }));
  }, [data, showErrors, paid, to]);
  const errorMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const i of issues) m[i.field] ??= i.message;
    if (badGlyphs.length) m.nativePlace ??= t('glyphError', { chars: badGlyphs.join(' ') });
    return m;
  }, [issues, badGlyphs, t]);

  const canLeaveStep = badGlyphs.length === 0;

  async function savePaid() {
    if (!paid || savingRef.current || photoPendingRef.current) return;
    setShowErrors(true);
    const checked = checkBiodata(data);
    const parsed = biodataSchema.safeParse(data);
    const clipped = measurePages();
    setOverflowPages(clipped);
    if (checked.length || !parsed.success || badGlyphs.length || clipped === null || clipped.length > 0) {
      const first = checked[0]?.field ?? (!parsed.success ? String(parsed.error.issues[0]?.path[0] ?? '') : '');
      if (['fullName', 'dob'].includes(first)) setStep(0);
      else if (['education', 'occupation', 'employer', 'workLocation', 'income'].includes(first)) setStep(1);
      else if (['phone', 'altPhone', 'email', 'address', 'contactName'].includes(first)) setStep(5);
      setSaveError(clipped === null ? t('measuringPages') : clipped.length ? to('editOverflow') : to('editInvalid'));
      return;
    }
    savingRef.current = true;
    historyGuard.current?.arm();
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(paid.token)}/edit`, {
        method: 'PATCH', cache: 'no-store', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ biodata: data, expectedRevision: paid.editsUsed })
      });
      if (!res.ok) { setSaveError(to(res.status === 409 || res.status === 404 ? 'editConflict' : 'editError')); return; }
      savedRef.current = true;
      setSaved(true);
    } catch {
      setSaveError(to('editError'));
    } finally {
      if (!savedRef.current) { savingRef.current = false; setSaving(false); }
    }
  }

  function cancelPaid() {
    if (paid && (!dirty || window.confirm(to('editUnsaved')))) router.push(`/orders/${paid.token}`);
  }

  function next() {
    if (photoPendingRef.current) return;
    setShowErrors(true);
    if (!canLeaveStep) { if (paid) setSaveError(t('glyphError', { chars: badGlyphs.join(' ') })); return; }
    if (step === 0 && checkBiodata(data).some((i) => i.field === 'fullName' || i.field === 'dob')) return;
    if (step < STEP_KEYS.length - 1) {
      setDirection(1);
      setStep(step + 1);
      setShowErrors(false);
      window.scrollTo({ top: 0 });
      return;
    }
    if (paid) void savePaid();
    else if (checkBiodata(data).length === 0) router.push('/review');
  }

  const panels = [
    <StepPersonal key="p" data={data} set={set} errors={errorMap} />,
    <StepWork key="w" data={data} set={set} errors={errorMap} />,
    <StepFamily key="f" data={data} set={set} />,
    <StepHoroscope key="h" data={data} set={set} />,
    <StepAbout key="a" data={data} set={set} />,
    <StepContact key="c" data={data} set={set} errors={errorMap} />,
    <PhotoStep key="ph" data={data} set={setPhoto} paid={!!paid} pending={photoPending} onPending={setPhotoPending} />
  ];

  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <header style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div
          className="shell"
          style={{ maxWidth: 1280, paddingBlock: 10, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px 24px' }}
        >
          {paid ? <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>Biodata Maker</span> : <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--ink)', textDecoration: 'none', minHeight: 'var(--tap)', display: 'flex', alignItems: 'center' }}>
            Biodata Maker
          </Link>}
          <p role="status" className="xsmall" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--teal-note)' }}>
            <LockIcon size={18} />
            {paid ? saved ? to('editSavedLabel') : to('editLeft', { left: paid.editLimit - paid.editsUsed, total: paid.editLimit }) : storageOk ? t('saved') : 'This browser is not letting us save a draft. Keep this tab open.'}
          </p>
          {paid ? <button type="button" className="btn btn-outline" disabled={saving} onClick={cancelPaid}>{to('editCancel')}</button> : <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 'var(--tap)', fontSize: 16, fontWeight: 500 }}>
            {t('saveExit')}
          </Link>}
        </div>

        <nav aria-label={t('steps')} className="shell" style={{ maxWidth: 1280, paddingBottom: 12, overflowX: 'auto' }}>
          <ol style={{ display: 'flex', gap: 6, minWidth: 'max-content' }}>
            <li>
              {paid ? <span className="chip">{t('stepTemplate')}</span> : <Link href="/templates" className="chip" style={{ minHeight: 40, fontSize: 15, background: 'var(--teal-100)', borderColor: 'transparent', color: 'var(--teal-800)' }}>
                <Tick size={16} />
                {t('stepTemplate')}
              </Link>}
            </li>
            {STEP_KEYS.map((key, i) => {
              const on = i === step;
              return (
                <li key={key}>
                  <button
                    type="button"
                    disabled={saving || photoPending}
                    aria-current={on ? 'step' : undefined}
                    onClick={() => {
                      setDirection(i >= step ? 1 : -1);
                      setStep(i);
                    }}
                    className="chip"
                    data-on={on ? 'true' : 'false'}
                    style={{ minHeight: 40, fontSize: 15, border: on ? undefined : '1.5px solid transparent' }}
                  >
                    {i + 2} {t(key)}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      <div className="shell" style={{ maxWidth: 1280, paddingTop: 28, paddingBottom: 48, display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
        <main id="main" className="panel" style={{ flex: '999 1 560px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h1 className="display" style={{ fontSize: 34 }}>
              {t(STEP_KEYS[step])}
            </h1>
            <p className="muted small">{t('optionalNote')}</p>
          </div>

          <p className="note">
            <LockIcon />
            {paid ? to('editPrivacy') : t('privacyNote')}
          </p>

          {issues.length ? (
            <div role="alert" className="note note-danger" style={{ flexDirection: 'column', gap: 6 }}>
              {issues.map((i) => (
                <span key={i.field + i.message} style={{ display: 'flex', gap: 8 }}>
                  <AlertIcon />
                  {i.message}
                </span>
              ))}
            </div>
          ) : null}
          {saveError && <p role="alert" className="note note-danger">{saveError}</p>}
          <p role="status" aria-live="polite" className="small muted">{saved ? to('editSaved') : saving ? to('editSavingWait') : ''}</p>
          {saved && paid && <a href={`/${locale}/orders/${encodeURIComponent(paid.token)}`} className="btn btn-primary" style={{ alignSelf: 'start' }}>{to('editOpenOrder')}</a>}

          {/* A short slide in the direction of travel, so moving between steps
              reads as one form rather than seven. */}
          <div inert={saving}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.form
              key={step}
              custom={direction}
              onSubmit={(e) => e.preventDefault()}
              inert={saving}
              variants={STEP_SLIDE}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: motionTokens.duration.fast }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '20px 24px' }}
            >
              {panels[step]}
            </motion.form>
          </AnimatePresence>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, paddingTop: 20, borderTop: '1px solid var(--line-soft)' }}>
            {step === 0 ? (
              paid ? <button type="button" className="btn btn-outline" disabled={saving} onClick={cancelPaid}>{to('editCancel')}</button> : <Link href="/templates" className="btn btn-outline">
                {t('back')}
              </Link>
            ) : (
              <button
                type="button"
                className="btn btn-outline"
                disabled={saving || photoPending}
                onClick={() => {
                  setDirection(-1);
                  setStep(step - 1);
                }}
              >
                {t('back')}
              </button>
            )}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {!paid && <button
                type="button"
                className="btn btn-outline"
                disabled={photoPending}
                onClick={() => {
                  if (window.confirm(t('clearDraftConfirm'))) {
                    clearDraft();
                    setData(emptyBiodata(def.slug, data.docLocale));
                    setStep(0);
                  }
                }}
              >
                {t('clearDraft')}
              </button>}
              {!saved && <button type="button" className="btn btn-primary" disabled={saving || photoPending} onClick={next}>
                {step === STEP_KEYS.length - 1 ? paid ? saving ? to('editSaving') : to('editSave') : t('toReview') : t('next')}
              </button>}
            </div>
          </div>
        </main>

        <aside aria-label={t('preview')} style={{ flex: '1 1 460px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <label className="field" style={{ flex: '1 1 180px', fontSize: 14 }}>
              {t('template')}
              <select
                value={data.templateSlug}
                disabled={saving}
                onChange={(e) => {
                  const slug = e.target.value;
                  const nextDef = templateBySlug(slug);
                  // Switching template never discards typed details, but a
                  // Devanagari-only template forces a document language it can set.
                  const docLocale: DocLocale = nextDef && !nextDef.docLocales.includes(data.docLocale) ? nextDef.docLocales[0] : data.docLocale;
                  set({ templateSlug: slug, docLocale });
                }}
              >
                {TEMPLATES.filter((x) => !paid || allowedTemplate(x, paid.templateSlug, paid.pricePaise)).map((x) => (
                  <option key={x.slug} value={x.slug}>
                    {x.title}, {formatINR(x.pricePaise)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" style={{ flex: '1 1 180px', fontSize: 14 }}>
              {tg('docLanguage')}
              <select value={data.docLocale} disabled={saving} onChange={(e) => set({ docLocale: e.target.value as DocLocale })}>
                {def.docLocales.map((l) => (
                  <option key={l} value={l} lang={l}>
                    {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div ref={sheetRef} onLoadCapture={() => setOverflowPages(measurePages())} style={{ alignSelf: 'center', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {([1, 2] as const).slice(0, def.pages).map((page) => (
              <div key={page} style={{ maxWidth: '100%' }}>
                {def.pages > 1 && <p className="small muted">{t('previewPage', { page, total: def.pages })}</p>}
                <ScaledSheet width={445} shadow watermark={tc('previewStamp')}>
                  <TemplateSheet data={data} accent={def.accent} page={page} instanceId={`editor-${page}`} />
                </ScaledSheet>
              </div>
            ))}
          </div>

          <div aria-live="polite" aria-atomic="true">
            {overflowPages === null ? <p className="xsmall muted">{t('measuringPages')}</p> :
              ([1, 2] as const).slice(0, def.pages).map((page) => (
                <p key={page} className="xsmall" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: overflowPages.includes(page) ? 'var(--danger)' : 'var(--teal-note)' }}>
                  {overflowPages.includes(page) ? <AlertIcon /> : <Tick size={18} />}
                  {t(overflowPages.includes(page) ? 'pageOverflow' : 'pageFits', { page })}
                </p>
              ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

