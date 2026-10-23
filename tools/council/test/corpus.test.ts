import { describe, expect, it } from "vitest";
import { resolvePaths } from "../src/config.ts";
import { buildIndex, dossierHash, loadIndex, readDossierFiles } from "../src/indexer.ts";
import { lintDossiers } from "../src/lint.ts";
import { normalizeForMatch, quoteFragments } from "../src/text.ts";
import { inOrder } from "../src/verify.ts";

// Integration checks over the real council: these are the invariants the skills rely on.
const paths = resolvePaths();
const files = readDossierFiles(paths.advisorsDir);
const index = buildIndex(files);

describe("real corpus", () => {
  it("has no lint errors", () => {
    expect(lintDossiers(files).filter((i) => i.level === "error")).toEqual([]);
  });

  it("indexes every dossier with unique card ids", () => {
    expect(index.advisors).toHaveLength(files.length);
    const ids = index.cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only extracts quotes that exist verbatim in the dossier body", () => {
    const bodies = new Map(files.map((f) => [f.slug, normalizeForMatch(f.text)]));
    const missing = index.cards.flatMap((c) => c.quotes.filter((q) => !bodies.get(c.advisor)?.includes(normalizeForMatch(q))));
    expect(missing).toEqual([]);
  });

  it("every extracted quote passes the strict verifier against its own card", () => {
    const trim = (t: string) => normalizeForMatch(t.replace(/^[\s,.;:!?'"()-]+|[\s,.;:!?'"()-]+$/g, ""));
    const failing = index.cards.flatMap((c) => {
      const text = normalizeForMatch(c.text);
      return c.quotes.filter((q) => !inOrder(quoteFragments(q).map(trim), text)).map((q) => `${c.id}: ${q}`);
    });
    expect(failing).toEqual([]);
  });

  it("committed index/ is fresh and matches what the current parser builds", () => {
    const committed = loadIndex(paths.indexDir);
    expect(committed.manifest.dossierHash).toBe(dossierHash(files));
    expect(committed.cards).toEqual(index.cards);
    expect(committed.edges).toEqual(index.edges);
  });
});
