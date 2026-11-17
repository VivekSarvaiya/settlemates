const CURRENCY_LOCALE = "en-IN";

const wholeRupeeFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const paiseFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const wholeInputFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  maximumFractionDigits: 0,
});

const paiseInputFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Accepts plain, western-grouped (1,234.50) and Indian-grouped (1,23,456) input, with optional ₹.
const AMOUNT_PATTERN =
  /^(?:₹\s*)?(?:(?:\d{1,3}(?:,\d{2,3})+|\d+)(?:\.\d{1,2})?|\.\d{1,2})$/;

/** Whole rupees stay clean (₹600); anything with paise always shows two digits (₹762.50). */
export function formatCents(cents: number): string {
  const formatter = cents % 100 === 0 ? wholeRupeeFormatter : paiseFormatter;
  return formatter.format(cents / 100);
}

/** Formats an amount for an input field: Indian digit grouping, no ₹ sign. */
export function formatAmountInput(cents: number): string {
  const formatter = cents % 100 === 0 ? wholeInputFormatter : paiseInputFormatter;
  return formatter.format(cents / 100);
}

export function parseAmountToCents(input: string): number | null {
  const value = input.trim();
  if (!AMOUNT_PATTERN.test(value)) return null;

  const numeric = value.replace(/^₹\s*/, "").replace(/,/g, "");
  const parsed = Number(numeric);
  if (!Number.isFinite(parsed)) return null;

  return Math.round(parsed * 100);
}
