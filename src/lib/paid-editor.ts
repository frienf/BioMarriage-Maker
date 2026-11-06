type EditStatus = { status: string; deleted: boolean; expiresAt: string | null; editsUsed: number; editLimit: number };

export function editAvailability(order: EditStatus, now = Date.now()) {
  if (order.deleted) return 'deleted';
  if (order.status !== 'paid') return 'unpaid';
  if (!order.expiresAt || !(Date.parse(order.expiresAt) > now)) return 'expired';
  if (order.editsUsed >= order.editLimit) return 'exhausted';
  return 'available';
}

export function allowedTemplate(template: { slug: string; pricePaise: number }, originalSlug: string, pricePaise: number) {
  return template.slug === originalSlug || template.pricePaise <= pricePaise;
}

/** Null means not all pages were measured; never treat that as fitting. */
export function overflowingPages(sheets: ArrayLike<{ scrollHeight: number }>, expected: number, pageHeight: number): number[] | null {
  if (sheets.length !== expected || Array.from(sheets).some((sheet) => !Number.isFinite(sheet.scrollHeight) || sheet.scrollHeight <= 0)) return null;
  return Array.from(sheets, (sheet, index) => sheet.scrollHeight > pageHeight + 2 ? index + 1 : 0).filter(Boolean);
}
