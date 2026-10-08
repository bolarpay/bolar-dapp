import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const root = process.env.BOLAR_QUOTE_TEST_OUTPUT;
const { parseAmount, convertAmount } = require(join(root, "remittance-quote.js"));
const { parseReferenceRate, loadReferenceRate, MAX_RATE_AGE_MS } = require(join(root, "exchange-rate.js"));
const { whatsappSupportUrl } = require(join(root, "support.js"));
const payload = (now = Date.now()) => ({ result: "success", base_code: "BRL", rates: { BOB: 2.40791 }, time_last_update_unix: Math.floor(now / 1000) });

test("converts using the supplied rate in both directions and accepts decimal comma", () => {
  assert.equal(convertAmount("500", "send", 2.40791), "1203.96");
  assert.equal(convertAmount("1203,96", "receive", 2.40791), "500");
  assert.equal(parseAmount("1,25"), 125);
  for (const input of ["-1", "Infinity", "1e3", "1.001", "1000000000"]) assert.equal(parseAmount(input), null);
});

test("does not calculate with invalid rates or out-of-range results", () => {
  for (const rate of [0, -1, Infinity, NaN]) assert.equal(convertAmount("500", "send", rate), "");
  assert.equal(convertAmount("999999999.99", "send", 3), "");
});

test("accepts the expected BRL/BOB response and rejects provider errors and incorrect currencies", () => {
  assert.equal(parseReferenceRate(payload()).rate, 2.40791);
  for (const value of [null, {}, { ...payload(), result: "error" }, { ...payload(), base_code: "USD" }, { ...payload(), rates: {} }, { ...payload(), rates: { BOB: "2.4" } }, { ...payload(), rates: { BOB: 0 } }]) {
    assert.throws(() => parseReferenceRate(value));
  }
});

test("rejects expired or future dated reference data", () => {
  const now = Date.now();
  assert.throws(() => parseReferenceRate(payload(now - MAX_RATE_AGE_MS - 1000), now));
  assert.throws(() => parseReferenceRate(payload(now + 10 * 60 * 1000), now));
});

test("coalesces requests, caches public data and does not reuse an expired cache after failure", async () => {
  const originalFetch = globalThis.fetch;
  const originalStorage = globalThis.localStorage;
  const cache = new Map();
  globalThis.localStorage = { getItem: key => cache.get(key) ?? null, setItem: (key, value) => cache.set(key, value) };
  let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json(payload()); };
  try {
    const [a, b] = await Promise.all([loadReferenceRate(), loadReferenceRate()]);
    assert.equal(a.rate, b.rate);
    assert.equal(calls, 1);
    await loadReferenceRate();
    assert.equal(calls, 1);
    const [key, value] = [...cache][0];
    cache.set(key, JSON.stringify({ ...JSON.parse(value), savedAt: Date.now() - 3_600_001 }));
    globalThis.fetch = async () => new Response("", { status: 429 });
    await assert.rejects(loadReferenceRate());
    globalThis.fetch = async () => Response.json(payload());
    assert.equal((await loadReferenceRate()).rate, a.rate);
  } finally { globalThis.fetch = originalFetch; globalThis.localStorage = originalStorage; }
});

test("reference fetching works when browser storage is blocked", async () => {
  const originalFetch = globalThis.fetch;
  const originalStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem() { throw new Error("Blocked"); }, setItem() { throw new Error("Blocked"); } };
  globalThis.fetch = async () => Response.json(payload());
  try { assert.equal((await loadReferenceRate()).rate, 2.40791); }
  finally { globalThis.fetch = originalFetch; globalThis.localStorage = originalStorage; }
});

test("WhatsApp is unconfigured without a valid international number and never embeds remittance data", () => {
  for (const value of [undefined, "", "123", "https://evil.example", "+591 abc 12345678"]) assert.equal(whatsappSupportUrl(value), null);
  const url = new URL(whatsappSupportUrl("+591 7000-0000"));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/59170000000");
  assert.equal(url.searchParams.get("text"), "Hola BOLAR, necesito ayuda con mi envío.");
});
