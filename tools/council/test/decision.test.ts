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
