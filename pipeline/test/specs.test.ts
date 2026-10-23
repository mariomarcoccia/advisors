import { describe, expect, it } from "vitest";
import { coverageProblems, parseSpec, SpecError, type Spec } from "../src/specs.ts";

const base = { slug: "jane-doe", name: "Jane Doe", lang: "en", corpus: "normal", person: "Jane Doe, founder of Example Co. NOT any other Jane Doe." };
const json = (value: unknown): string => JSON.stringify(value);

describe("parseSpec", () => {
  it("accepts a minimal spec", () => {
    expect(parseSpec("jane-doe.json", json(base)).slug).toBe("jane-doe");
  });

  it("rejects a slug that does not match the file name", () => {
    expect(() => parseSpec("john.json", json(base))).toThrow(/does not match/);
  });

  it("rejects unknown fields, bad enums and invalid JSON", () => {
    expect(() => parseSpec("jane-doe.json", json({ ...base, extra: 1 }))).toThrow(SpecError);
    expect(() => parseSpec("jane-doe.json", json({ ...base, lang: "fr" }))).toThrow(SpecError);
    expect(() => parseSpec("jane-doe.json", "{ nope")).toThrow(/invalid JSON/);
  });

  it("rejects placeholders the engine would not fill", () => {
    const prompt = "Enumerate material for {{PERSON}} as of {{TODAY}} with ${slug} and more words here";
    expect(() => parseSpec("jane-doe.json", json({ ...base, enumPrompts: [{ label: "own", prompt }] }))).toThrow(/TODAY.*slug/);
  });
});

describe("coverageProblems", () => {
  const spec = (slug: string, extra: Partial<Spec> = {}): Spec => ({ ...(base as Spec), slug, ...extra });

  it("reports dossiers without specs, specs without dossiers, and bad examples", () => {
    const problems = coverageProblems([spec("a"), spec("new-one", { example: "ghost" })], ["a", "b"]);
    expect(problems).toEqual([
      "advisors/b.md has no pipeline/specs/b.json",
      "specs/new-one.json has no dossier yet (fine before a first \"create\" run)",
      "specs/new-one.json: example \"ghost\" is not a dossier",
    ]);
  });
});
