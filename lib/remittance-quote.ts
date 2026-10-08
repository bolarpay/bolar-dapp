export function parseAmount(value: string): number | null {
  if (!/^\d{1,9}(?:[.,]\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.replace(",", ".").split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

export function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2).replace(/\.?0+$/, "");
}

export function convertAmount(value: string, direction: "send" | "receive", rate: number): string {
  const cents = parseAmount(value);
  if (cents === null || !Number.isFinite(rate) || rate <= 0) return "";
  const converted = direction === "send" ? Math.round(cents * rate) : Math.round(cents / rate);
  if (!Number.isSafeInteger(converted) || converted > 99_999_999_999) return "";
  return formatAmount(converted);
}
