'use client';

import { useTranslations } from 'next-intl';
import type { Biodata } from '@/lib/biodata';
import { Area, Fieldset, Select, Text, Toggle } from './fields';
import { PhotoStep } from './photo-step';

export type Patch = (p: Partial<Biodata>) => void;

/** Heights families actually write, as centimetres with a ft/in label. */
const HEIGHTS = Array.from({ length: 56 }, (_, i) => {
  const totalIn = 48 + i; // 4 ft 0 in upwards
  const cm = Math.round(totalIn * 2.54);
  return { value: String(cm), label: `${Math.floor(totalIn / 12)} ft ${totalIn % 12} in` };
});

export function StepPersonal({ data, set, errors }: { data: Biodata; set: Patch; errors: Record<string, string> }) {
  const f = useTranslations('fields');
  return (
    <>
      <Text span label={f('fullName')} hint={f('fullNameHint')} value={data.fullName} maxLength={80} error={errors.fullName} onChange={(v) => set({ fullName: v })} autoComplete="name" />
      <Fieldset legend={f('profileFor')}>
        {(['bride', 'groom', 'unspecified'] as const).map((p) => (
          <label key={p} className="radio-card">
            <input type="radio" name="profileType" checked={data.profileType === p} onChange={() => set({ profileType: p })} />
            {f(p)}
          </label>
        ))}
      </Fieldset>
      <Text label={f('dob')} type="date" value={data.dob} error={errors.dob} onChange={(v) => set({ dob: v })} />
      <Text label={f('tob')} optional={f('optional')} type="time" value={data.tob ?? ''} onChange={(v) => set({ tob: v })} />
      <Text label={f('pob')} optional={f('optional')} value={data.pob ?? ''} onChange={(v) => set({ pob: v })} />
      <Select
        label={f('height')}
        optional={f('optional')}
        value={data.heightCm ? String(data.heightCm) : ''}
        options={[{ value: '', label: f('none') }, ...HEIGHTS]}
        onChange={(v) => set({ heightCm: v ? Number(v) : undefined })}
      />
      <Text label={f('religion')} optional={f('optional')} value={data.religion ?? ''} onChange={(v) => set({ religion: v })} />
      <Text label={f('caste')} optional={f('optional')} value={data.caste ?? ''} onChange={(v) => set({ caste: v })} />
      <Text label={f('motherTongue')} optional={f('optional')} value={data.motherTongue ?? ''} onChange={(v) => set({ motherTongue: v })} />
      <Text label={f('nativePlace')} optional={f('optional')} value={data.nativePlace ?? ''} error={errors.nativePlace} onChange={(v) => set({ nativePlace: v })} />
      <Select
        label={f('diet')}
        optional={f('optional')}
        value={data.diet ?? ''}
        options={[
          { value: '', label: f('none') },
          { value: 'vegetarian', label: 'Vegetarian' },
          { value: 'eggetarian', label: 'Eggetarian' },
          { value: 'non-vegetarian', label: 'Non-vegetarian' },
          { value: 'jain', label: 'Jain' },
          { value: 'vegan', label: 'Vegan' }
        ]}
        onChange={(v) => set({ diet: v as Biodata['diet'] })}
      />
      <Text label={f('complexion')} optional={f('optional')} value={data.complexion ?? ''} onChange={(v) => set({ complexion: v })} />
    </>
  );
}

export function StepWork({ data, set }: { data: Biodata; set: Patch }) {
  const f = useTranslations('fields');
  const rows = data.education ?? [];
  const update = (i: number, patch: Partial<(typeof rows)[number]>) =>
    set({ education: rows.map((r, j) => (i === j ? { ...r, ...patch } : r)) });

  return (
    <>
      {rows.map((row, i) => (
        <fieldset key={i} style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 16, alignItems: 'end' }}>
          <legend className="visually-hidden">{`${f('qualification')} ${i + 1}`}</legend>
          <Text label={f('qualification')} value={row.qualification} onChange={(v) => update(i, { qualification: v })} />
          <Text label={f('institution')} optional={f('optional')} value={row.institution ?? ''} onChange={(v) => update(i, { institution: v })} />
          <Text label={f('year')} optional={f('optional')} inputMode="numeric" maxLength={4} value={row.year ?? ''} onChange={(v) => update(i, { year: v })} />
          <button type="button" className="btn btn-outline" onClick={() => set({ education: rows.filter((_, j) => j !== i) })}>
            {f('removeRow')}
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        className="btn btn-outline-brand"
        style={{ gridColumn: '1 / -1', justifySelf: 'start' }}
        disabled={rows.length >= 5}
        onClick={() => set({ education: [...rows, { qualification: '', institution: '', year: '' }] })}
      >
        {f('addEducation')}
      </button>
      <Text label={f('occupation')} optional={f('optional')} value={data.occupation ?? ''} onChange={(v) => set({ occupation: v })} />
      <Text label={f('employer')} optional={f('optional')} value={data.employer ?? ''} onChange={(v) => set({ employer: v })} />
      <Text label={f('workLocation')} optional={f('optional')} value={data.workLocation ?? ''} onChange={(v) => set({ workLocation: v })} />
      <Text label={f('income')} optional={f('optional')} value={data.income ?? ''} onChange={(v) => set({ income: v })} />
    </>
  );
}

export function StepFamily({ data, set }: { data: Biodata; set: Patch }) {
  const f = useTranslations('fields');
  const sibs = data.siblings ?? [];
  const update = (i: number, patch: Partial<(typeof sibs)[number]>) =>
    set({ siblings: sibs.map((s, j) => (i === j ? { ...s, ...patch } : s)) });

  return (
    <>
      <Toggle label={f('showFamily')} checked={data.showFamily ?? true} onChange={(v) => set({ showFamily: v })} />
      {data.showFamily !== false ? (
        <>
          <Text label={f('fatherName')} optional={f('optional')} value={data.fatherName ?? ''} onChange={(v) => set({ fatherName: v })} />
          <Text label={f('fatherOccupation')} optional={f('optional')} value={data.fatherOccupation ?? ''} onChange={(v) => set({ fatherOccupation: v })} />
          <Text label={f('motherName')} optional={f('optional')} value={data.motherName ?? ''} onChange={(v) => set({ motherName: v })} />
          <Text label={f('motherOccupation')} optional={f('optional')} value={data.motherOccupation ?? ''} onChange={(v) => set({ motherOccupation: v })} />

          {sibs.map((s, i) => (
            <fieldset key={i} style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 16, alignItems: 'end' }}>
              <legend className="visually-hidden">{`${f('siblings')} ${i + 1}`}</legend>
              <Select
                label={f('siblings')}
                value={s.relation}
                options={[
                  { value: 'brother', label: f('brother') },
                  { value: 'sister', label: f('sister') }
                ]}
                onChange={(v) => update(i, { relation: v as 'brother' | 'sister' })}
              />
              <Text label={f('fullName')} value={s.name ?? ''} onChange={(v) => update(i, { name: v })} />
              <Text label={f('siblingNote')} optional={f('optional')} value={s.note ?? ''} onChange={(v) => update(i, { note: v })} />
              <button type="button" className="btn btn-outline" onClick={() => set({ siblings: sibs.filter((_, j) => j !== i) })}>
                {f('removeRow')}
              </button>
            </fieldset>
          ))}
          <button
            type="button"
            className="btn btn-outline-brand"
            style={{ gridColumn: '1 / -1', justifySelf: 'start' }}
            disabled={sibs.length >= 6}
            onClick={() => set({ siblings: [...sibs, { relation: 'brother', name: '', note: '' }] })}
          >
            {f('addSibling')}
          </button>

          <Select
            label={f('familyType')}
            optional={f('optional')}
            value={data.familyType ?? ''}
            options={[
              { value: '', label: f('none') },
              { value: 'nuclear', label: f('nuclear') },
              { value: 'joint', label: f('joint') }
            ]}
            onChange={(v) => set({ familyType: v as Biodata['familyType'] })}
          />
          <Text label={f('familyNativePlace')} optional={f('optional')} value={data.familyNativePlace ?? ''} onChange={(v) => set({ familyNativePlace: v })} />
        </>
      ) : null}
    </>
  );
}

export function StepHoroscope({ data, set }: { data: Biodata; set: Patch }) {
  const f = useTranslations('fields');
  return (
    <>
      <Toggle label={f('showHoroscope')} checked={data.showHoroscope ?? false} onChange={(v) => set({ showHoroscope: v })} />
      {data.showHoroscope ? (
        <>
          <Text label={f('rashi')} optional={f('optional')} value={data.rashi ?? ''} onChange={(v) => set({ rashi: v })} />
          <Text label={f('nakshatra')} optional={f('optional')} value={data.nakshatra ?? ''} onChange={(v) => set({ nakshatra: v })} />
          <Text label={f('gotra')} optional={f('optional')} value={data.gotra ?? ''} onChange={(v) => set({ gotra: v })} />
          <Select
            label={f('manglik')}
            optional={f('optional')}
            value={data.manglik ?? ''}
            options={[
              { value: '', label: f('none') },
              { value: 'no', label: f('no') },
              { value: 'yes', label: f('yes') },
              { value: 'partial', label: f('partial') },
              { value: 'unknown', label: f('unknown') }
            ]}
            onChange={(v) => set({ manglik: v as Biodata['manglik'] })}
          />
          <Text label={f('gan')} optional={f('optional')} value={data.gan ?? ''} onChange={(v) => set({ gan: v })} />
          <Text label={f('nadi')} optional={f('optional')} value={data.nadi ?? ''} onChange={(v) => set({ nadi: v })} />
          <Text label={f('charan')} optional={f('optional')} value={data.charan ?? ''} onChange={(v) => set({ charan: v })} />
        </>
      ) : null}
    </>
  );
}

export function StepAbout({ data, set }: { data: Biodata; set: Patch }) {
  const f = useTranslations('fields');
  return (
    <>
      <Area label={f('about')} optional={f('optional')} hint={f('aboutHint')} maxLength={600} value={data.about ?? ''} onChange={(v) => set({ about: v })} />
      <Area label={f('expectations')} optional={f('optional')} maxLength={600} value={data.expectations ?? ''} onChange={(v) => set({ expectations: v })} />
    </>
  );
}

export function StepContact({ data, set, errors }: { data: Biodata; set: Patch; errors: Record<string, string> }) {
  const f = useTranslations('fields');
  return (
    <>
      <Text label={f('contactName')} optional={f('optional')} value={data.contactName ?? ''} onChange={(v) => set({ contactName: v })} />
      <Text label={f('phone')} inputMode="tel" autoComplete="tel" value={data.phone ?? ''} error={errors.phone} onChange={(v) => set({ phone: v })} />
      <Text label={f('altPhone')} optional={f('optional')} inputMode="tel" value={data.altPhone ?? ''} onChange={(v) => set({ altPhone: v })} />
      <Text label={f('email')} optional={f('optional')} type="email" inputMode="email" autoComplete="email" value={data.email ?? ''} error={errors.email} onChange={(v) => set({ email: v })} />
      <Area label={f('address')} optional={f('optional')} maxLength={600} value={data.address ?? ''} onChange={(v) => set({ address: v })} />
    </>
  );
}

export { PhotoStep };
