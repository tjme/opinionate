export function formatCurrency(value: string): string | undefined {
  if (value) { const v = +value; return v.toLocaleString("en-GB", {style: "currency", currency: "GBP"}); } };

export function formatDate(value: string): string | undefined {
  if (value) { const v = new Date(value); return v.toLocaleString("en-GB", {year: "numeric", month: "short", day: "numeric"}); } };

export function formatDateTime(value: string): string | undefined {
  // Formatted partially for acceptability by PrimeVue DatePicker
  if (value) { const v = new Date(value); return v.toLocaleString("en-GB", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})?.replace(', ',' '); } };
