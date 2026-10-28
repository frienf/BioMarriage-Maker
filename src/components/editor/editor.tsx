'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import type { Biodata, DocLocale } from '@/lib/biodata';
import { checkBiodata, emptyBiodata } from '@/lib/biodata';
import { unsupportedIn } from '@/lib/glyphs';
import { clearDraft, loadDraft, saveDraft } from '@/lib/draft';
import { TEMPLATES, templateBySlug } from '@/templates/catalog';
import { A4, ScaledSheet, TemplateSheet } from '@/templates/render';
import { sampleFor } from '@/templates/sample';
import { formatINR } from '@/lib/money';
import { AlertIcon, LockIcon, Tick } from '@/components/toran';
import { StepAbout, StepContact, StepFamily, StepHoroscope, StepPersonal, StepWork, PhotoStep } from './steps';

const STEP_KEYS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'] as const;

/** A short slide in the direction of travel. `custom` carries +1 forward,
 *  -1 back, so going back does not look like going on. */
const STEP_SLIDE = {
  enter: (d: number) => ({ opacity: 0, x: d * motionTokens.distance.md }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -motionTokens.distance.md })
};

export function Editor({ initialSlug, useSample }: { initialSlug: string; useSample: boolean }) {
  const t = useTranslations('editor');
  const tg = useTranslations('gallery');
  const tc = useTranslations('common');
  const router = useRouter();
  const [data, setData] = useState<Biodata>(() => emptyBiodata(initialSlug, 'en'));
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [overflows, setOverflows] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Load the draft on the client only: the server has never seen it.
  useEffect(() => {
    const saved = loadDraft();
    if (saved) setData({ ...saved, templateSlug: initialSlug || saved.templateSlug });
    else if (useSample) setData({ ...sampleFor(initialSlug, 'en'), templateSlug: initialSlug });
    setHydrated(true);
  }, [initialSlug, useSample]);

  // Autosave, debounced: a keystroke should not hit storage.
  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => setStorageOk(saveDraft(data)), 500);
    return () => window.clearTimeout(id);
  }, [data, hydrated]);

  // Does it still fit on one sheet? Measured, not estimated.
  useEffect(() => {
    const el = sheetRef.current?.querySelector('article');
    if (!el) return;
    setOverflows(el.scrollHeight > A4.h + 2);
  }, [data]);

  const set = useCallback((patch: Partial<Biodata>) => setData((d) => ({ ...d, ...patch })), []);

  const def = templateBySlug(data.templateSlug) ?? TEMPLATES[0];
  const badGlyphs = useMemo(() => {
    const { photo: _photo, ...text } = data;
    return unsupportedIn(text);
  }, [data]);

  const issues = useMemo(() => (showErrors ? checkBiodata(data) : []), [data, showErrors]);
  const errorMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const i of issues) m[i.field] ??= i.message;
    if (badGlyphs.length) m.nativePlace ??= t('glyphError', { chars: badGlyphs.join(' ') });
    return m;
  }, [issues, badGlyphs, t]);

  const canLeaveStep = badGlyphs.length === 0;

  function next() {
    setShowErrors(true);
    if (!canLeaveStep) return;
    if (step === 0 && checkBiodata(data).some((i) => i.field === 'fullName' || i.field === 'dob')) return;
    if (step < STEP_KEYS.length - 1) {
      setDirection(1);
      setStep(step + 1);
      setShowErrors(false);
      window.scrollTo({ top: 0 });
      return;
    }
    if (checkBiodata(data).length === 0) router.push('/review');
  }

  const panels = [
    <StepPersonal key="p" data={data} set={set} errors={errorMap} />,
    <StepWork key="w" data={data} set={set} />,
    <StepFamily key="f" data={data} set={set} />,
    <StepHoroscope key="h" data={data} set={set} />,
    <StepAbout key="a" data={data} set={set} />,
    <StepContact key="c" data={data} set={set} errors={errorMap} />,
    <PhotoStep key="ph" data={data} set={set} />
  ];

  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <header style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div
          className="shell"
          style={{ maxWidth: 1280, paddingBlock: 10, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px 24px' }}
        >
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--ink)', textDecoration: 'none', minHeight: 'var(--tap)', display: 'flex', alignItems: 'center' }}>
            Biodata Maker
          </Link>
          <p role="status" className="xsmall" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--teal-note)' }}>
            <LockIcon size={18} />
            {storageOk ? t('saved') : 'This browser is not letting us save a draft. Keep this tab open.'}
          </p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 'var(--tap)', fontSize: 16, fontWeight: 500 }}>
            {t('saveExit')}
          </Link>
        </div>

        <nav aria-label={t('steps')} className="shell" style={{ maxWidth: 1280, paddingBottom: 12, overflowX: 'auto' }}>
          <ol style={{ display: 'flex', gap: 6, minWidth: 'max-content' }}>
            <li>
              <Link href="/templates" className="chip" style={{ minHeight: 40, fontSize: 15, background: 'var(--teal-100)', borderColor: 'transparent', color: 'var(--teal-800)' }}>
                <Tick size={16} />
                {t('stepTemplate')}
              </Link>
            </li>
            {STEP_KEYS.map((key, i) => {
              const on = i === step;
              return (
                <li key={key}>
                  <button
                    type="button"
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
            {t('privacyNote')}
          </p>

          {issues.length ? (
            <div className="note note-danger" style={{ flexDirection: 'column', gap: 6 }}>
              {issues.map((i) => (
                <span key={i.field + i.message} style={{ display: 'flex', gap: 8 }}>
                  <AlertIcon />
                  {i.message}
                </span>
              ))}
            </div>
          ) : null}

          {/* A short slide in the direction of travel, so moving between steps
              reads as one form rather than seven. */}
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.form
              key={step}
              custom={direction}
              onSubmit={(e) => e.preventDefault()}
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

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, paddingTop: 20, borderTop: '1px solid var(--line-soft)' }}>
            {step === 0 ? (
              <Link href="/templates" className="btn btn-outline">
                {t('back')}
              </Link>
            ) : (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setDirection(-1);
                  setStep(step - 1);
                }}
              >
                {t('back')}
              </button>
            )}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  if (window.confirm(t('clearDraftConfirm'))) {
                    clearDraft();
                    setData(emptyBiodata(def.slug, data.docLocale));
                    setStep(0);
                  }
                }}
              >
                {t('clearDraft')}
              </button>
              <button type="button" className="btn btn-primary" onClick={next}>
                {step === STEP_KEYS.length - 1 ? t('toReview') : t('next')}
              </button>
            </div>
          </div>
        </main>

        <aside aria-label={t('preview')} style={{ flex: '1 1 460px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <label className="field" style={{ flex: '1 1 180px', fontSize: 14 }}>
              {t('template')}
              <select
                value={data.templateSlug}
                onChange={(e) => {
                  const slug = e.target.value;
                  const nextDef = templateBySlug(slug);
                  // Switching template never discards typed details, but a
                  // Devanagari-only template forces a document language it can set.
                  const docLocale: DocLocale = nextDef && !nextDef.docLocales.includes(data.docLocale) ? nextDef.docLocales[0] : data.docLocale;
                  set({ templateSlug: slug, docLocale });
                }}
              >
                {TEMPLATES.map((x) => (
                  <option key={x.slug} value={x.slug}>
                    {x.title}, {formatINR(x.pricePaise)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" style={{ flex: '1 1 180px', fontSize: 14 }}>
              {tg('docLanguage')}
              <select value={data.docLocale} onChange={(e) => set({ docLocale: e.target.value as DocLocale })}>
                {def.docLocales.map((l) => (
                  <option key={l} value={l} lang={l}>
                    {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div ref={sheetRef} style={{ alignSelf: 'center', maxWidth: '100%' }}>
            <ScaledSheet width={445} shadow watermark={tc('previewStamp')}>
              <TemplateSheet data={data} accent={def.accent} instanceId="editor" />
            </ScaledSheet>
          </div>

          <p
            className="xsmall"
            style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: overflows ? 'var(--danger)' : 'var(--teal-note)' }}
          >
            {overflows ? <AlertIcon /> : <Tick size={18} />}
            {overflows ? t('mayOverflow') : t('fitsOnePage')}
          </p>
        </aside>
      </div>
    </div>
  );
}

