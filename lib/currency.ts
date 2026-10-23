const CURRENCY_LOCALE = "en-IN";

const amountFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// Accepts plain, western-grouped (1,234.50) and Indian-grouped (1,23,456) input, with optional ₹.
const AMOUNT_PATTERN =
  /^(?:₹\s*)?(?:(?:\d{1,3}(?:,\d{2,3})+|\d+)(?:\.\d{1,2})?|\.\d{1,2})$/;

export function formatCents(cents: number): string {
  return amountFormatter.format(cents / 100);
}

export function parseAmountToCents(input: string): number | null {
  const value = input.trim();
  if (!AMOUNT_PATTERN.test(value)) return null;

  const numeric = value.replace(/^₹\s*/, "").replace(/,/g, "");
  const parsed = Number(numeric);
  if (!Number.isFinite(parsed)) return null;

  return Math.round(parsed * 100);
}
