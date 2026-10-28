/**
 * Money is always an integer number of paise. Nothing here ever sees a float:
 * Razorpay takes paise, and 49.00 in a double is how a refund goes wrong.
 */
export type Paise = number;

export function rupeesToPaise(rupees: number): Paise {
  if (!Number.isFinite(rupees)) throw new Error('Not a number of rupees');
  return Math.round(rupees * 100);
}

export function formatINR(paise: Paise, locale = 'en-IN'): string {
  const whole = paise % 100 === 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2
  }).format(paise / 100);
}
