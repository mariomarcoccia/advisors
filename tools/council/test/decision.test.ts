import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assertShareable, findSensitive, readDecision, SensitiveDecisionError } from "../src/decision.ts";

describe("sensitive data guard", () => {
  it("detects amounts, emails, tax ids and urls", () => {
    const kinds = findSensitive("R$ 3M revenue, mail a@b.co, CNPJ 43.776.754/0001-40, see https://x.io").map((h) => h.kind);
    expect(kinds).toEqual(["email", "currency amount", "brazilian tax id", "url"]);
  });

  it("passes an anonymized abstract and can be overridden", () => {
    expect(() => assertShareable("A small B2B company with a static market.", false)).not.toThrow();
    expect(() => assertShareable("We made R$3M", false)).toThrow(SensitiveDecisionError);
    expect(() => assertShareable("We made R$3M", true)).not.toThrow();
  });
});

describe("readDecision", () => {
  it("strips frontmatter and rejects empty files", () => {
    const dir = mkdtempSync(join(tmpdir(), "dec-"));
    writeFileSync(join(dir, "d.md"), "---\ntopic: x\n---\nThe decision body.\n");
    writeFileSync(join(dir, "e.md"), "---\ntopic: x\n---\n");
    expect(readDecision(join(dir, "d.md"))).toBe("The decision body.");
    expect(() => readDecision(join(dir, "e.md"))).toThrow(SensitiveDecisionError);
  });
});

describe("council check", () => {
  it("accepts a clean abstract and flags sensitive, short, or Portuguese text", async () => {
    const { runCheck } = await import("../src/commands/check.ts");
    const dir = mkdtempSync(join(tmpdir(), "chk-"));
    const clean = join(dir, "clean.md");
    const bad = join(dir, "bad.md");
    writeFileSync(clean, "A founder must decide between harvesting a mature niche business and pivoting. ".repeat(6));
    writeFileSync(bad, "A empresa faturou R$ 3M e você não sabe a decisão.");
    const out: string[] = [];
    const ctx = (path: string) => ({ args: [path], flags: {}, paths: {} as never, env: {}, out: (t: string) => void out.push(t), warn: () => {} });
    expect(await runCheck(ctx(clean))).toBe(0);
    expect(await runCheck(ctx(bad))).toBe(1);
    expect(out[1]).toMatch(/currency amount[\s\S]*too short[\s\S]*non-English/);
  });
});
