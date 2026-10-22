import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CachedJev } from "../src/cache.ts";
import { backoffMs, JevApiError, JevClient, JevConfigError, mapLimit, nouls } from "../src/jev.ts";
import { FakeJev } from "./helpers.ts";

const OK_BODY = { model: "jev-1.13.0", answers: { q: { type: "noul", noul: 0.9 } }, usage: { input_tokens: 5, output_tokens: 1 } };

function scripted(responses: Response[]): { fetchImpl: typeof fetch; calls: RequestInit[] } {
  const calls: RequestInit[] = [];
  const fetchImpl = ((_url: string, init: RequestInit) => {
    calls.push(init);
    const next = responses.shift();
    if (!next) throw new Error("no scripted response left");
    return Promise.resolve(next);
  }) as typeof fetch;
  return { fetchImpl, calls };
}

const json = (status: number, body: unknown, headers: Record<string, string> = {}): Response =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

const REQUEST = { state: "s", questions: { q: { type: "noul" as const, instructions: "q?" } } };

describe("JevClient", () => {
  it("requires an API key", () => {
    expect(() => new JevClient({ apiKey: "", model: "m" })).toThrow(JevConfigError);
  });

  it("sends the pinned model and bearer token", async () => {
    const { fetchImpl, calls } = scripted([json(200, OK_BODY)]);
    const client = new JevClient({ apiKey: "k", model: "jev-1.13.0", fetchImpl });
    const response = await client.systemOne(REQUEST);
    expect(nouls(response).get("q")).toBe(0.9);
    expect(JSON.parse(String(calls[0]?.body))).toMatchObject({ model: "jev-1.13.0", state: "s" });
    expect((calls[0]?.headers as Record<string, string>)["Authorization"]).toBe("Bearer k");
  });

  it("retries 429 and 529, honoring retry-after", async () => {
    const waits: number[] = [];
    const { fetchImpl, calls } = scripted([json(429, {}, { "retry-after": "2" }), json(529, {}), json(200, OK_BODY)]);
    const client = new JevClient({ apiKey: "k", model: "m", fetchImpl, sleep: async (ms) => void waits.push(ms) });
    await client.systemOne(REQUEST);
    expect(calls).toHaveLength(3);
    expect(waits).toEqual([2000, 1000]);
  });

  it("does not retry client errors", async () => {
    const { fetchImpl, calls } = scripted([json(401, { detail: "bad key" })]);
    const client = new JevClient({ apiKey: "k", model: "m", fetchImpl });
    await expect(client.systemOne(REQUEST)).rejects.toThrow(JevApiError);
    expect(calls).toHaveLength(1);
  });

  it("gives up after maxRetries", async () => {
    const { fetchImpl } = scripted([json(529, {}), json(529, {})]);
    const client = new JevClient({ apiKey: "k", model: "m", fetchImpl, maxRetries: 1, sleep: async () => {} });
    await expect(client.systemOne(REQUEST)).rejects.toMatchObject({ status: 529 });
  });

  it("rejects malformed responses", async () => {
    const { fetchImpl } = scripted([json(200, { model: "m", answers: { q: { type: "noul", noul: 7 } }, usage: { input_tokens: 1, output_tokens: 1 } })]);
    await expect(new JevClient({ apiKey: "k", model: "m", fetchImpl }).systemOne(REQUEST)).rejects.toThrow();
  });
});

describe("backoffMs", () => {
  it("is exponential and capped, or follows retry-after", () => {
    expect([0, 1, 2, 10].map((a) => backoffMs(a, null))).toEqual([500, 1000, 2000, 8000]);
    expect(backoffMs(0, "120")).toBe(30_000);
  });
});

describe("mapLimit", () => {
  it("preserves order under bounded concurrency", async () => {
    let active = 0;
    let peak = 0;
    const out = await mapLimit([5, 1, 3, 2], 2, async (n) => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((r) => setTimeout(r, n));
      active -= 1;
      return n * 10;
    });
    expect(out).toEqual([50, 10, 30, 20]);
    expect(peak).toBe(2);
  });
});

describe("CachedJev", () => {
  it("serves repeats from disk", async () => {
    const fake = new FakeJev();
    const cached = new CachedJev(fake, join(mkdtempSync(join(tmpdir(), "jev-")), "c"), "m");
    const request = { state: { decision: "raise prices" }, questions: { q: { type: "noul" as const, instructions: { material: "prices" } } } };
    const first = await cached.systemOne(request);
    const second = await cached.systemOne(request);
    expect(second).toEqual(first);
    expect([fake.calls.length, cached.hits, cached.misses]).toEqual([1, 1, 1]);
  });
});
