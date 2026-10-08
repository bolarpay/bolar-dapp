export type ReferenceRate = { rate: number; updatedAt: number };
export const RATE_ENDPOINT = "https://open.er-api.com/v6/latest/BRL";
export const MAX_RATE_AGE_MS = 48 * 60 * 60 * 1000;
const CACHE_KEY = "bolar:brl-bob-reference:v1";
const CACHE_MS = 60 * 60 * 1000;

export function isFreshRate(quote: ReferenceRate, now = Date.now()): boolean {
  return Number.isFinite(quote.rate) && quote.rate > 0 && quote.rate < 10_000
    && Number.isFinite(quote.updatedAt) && quote.updatedAt > 0
    && quote.updatedAt <= now + 5 * 60 * 1000 && now - quote.updatedAt < MAX_RATE_AGE_MS;
}

export function parseReferenceRate(data: unknown, now = Date.now()): ReferenceRate {
  if (!data || typeof data !== "object") throw new Error("Respuesta de cambio inválida.");
  const payload = data as Record<string, unknown>;
  const rates = payload.rates as Record<string, unknown> | undefined;
  if (payload.result !== "success" || payload.base_code !== "BRL"
    || typeof rates?.BOB !== "number" || typeof payload.time_last_update_unix !== "number") {
    throw new Error("No se recibió una referencia BRL/BOB válida.");
  }
  const quote = { rate: rates.BOB, updatedAt: payload.time_last_update_unix * 1000 };
  if (!isFreshRate(quote, now)) throw new Error("El tipo de cambio no está actualizado.");
  return quote;
}

let pending: Promise<ReferenceRate> | null = null;

// Only public reference data is cached. No account, amount or recipient is sent.
export async function loadReferenceRate(): Promise<ReferenceRate> {
  const now = Date.now();
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    if (cached && typeof cached.savedAt === "number" && cached.savedAt <= now
      && now - cached.savedAt < CACHE_MS && isFreshRate(cached, now)) {
      return { rate: cached.rate, updatedAt: cached.updatedAt };
    }
  } catch { /* Storage can be unavailable; fetching still works. */ }
  if (pending) return pending;
  pending = (async () => {
    const response = await fetch(RATE_ENDPOINT, { signal: AbortSignal.timeout(8000), cache: "no-store", credentials: "omit" });
    if (!response.ok) throw new Error("El servicio de cambio no está disponible.");
    const quote = parseReferenceRate(await response.json());
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ...quote, savedAt: Date.now() })); } catch {}
    return quote;
  })();
  try { return await pending; } finally { pending = null; }
}
