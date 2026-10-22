import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { runGraph, runIndex } from "../src/commands/index-cmds.ts";
import { runPack, runSelect } from "../src/commands/retrieval.ts";
import { UsageError, type CommandContext, type Flags } from "../src/commands/types.ts";
import { runVerify } from "../src/commands/verify.ts";
import { resolvePaths } from "../src/config.ts";
import { SensitiveDecisionError } from "../src/decision.ts";

function ctx(args: string[], flags: Flags, env: NodeJS.ProcessEnv = {}): CommandContext & { lines: string[] } {
  const lines: string[] = [];
  return { args, flags, paths: resolvePaths(), env, out: (t) => void lines.push(t), warn: () => {}, lines };
}

const dir = mkdtempSync(join(tmpdir(), "cli-"));
const decision = join(dir, "d.md");
writeFileSync(decision, "A founder must choose between harvesting a mature niche business and pivoting into an adjacent market with momentum.");

describe("commands over the real index", () => {
  it("index --check reports fresh", async () => {
    const c = ctx([], { check: true });
    expect(await runIndex(c)).toBe(0);
  });

  it("select composes a board offline (BM25 fallback without a key)", async () => {
    const c = ctx([], { decision, k: "3", json: true });
    expect(await runSelect(c)).toBe(0);
    const out = JSON.parse(c.lines[0] ?? "{}") as { scorer: string; board: unknown[] };
    expect([out.scorer, out.board.length]).toEqual(["bm25", 3]);
  });

  it("pack renders citable cards and refuses unknown advisors", async () => {
    const c = ctx(["paul-graham"], { decision, scorer: "bm25" });
    expect(await runPack(c)).toBe(0);
    expect(c.lines[0]).toMatch(/\[paul-graham\/sum-[0-9a-f]{6}\]/);
    await expect(runPack(ctx(["nobody"], { decision, scorer: "bm25" }))).rejects.toThrow(UsageError);
  });

  it("refuses to send sensitive decisions to Jev", async () => {
    const leaky = join(dir, "leaky.md");
    writeFileSync(leaky, "We made R$ 3 million last year.");
    await expect(runSelect(ctx([], { decision: leaky, scorer: "jev" }, { TYPESAFE_API_KEY: "test" }))).rejects.toThrow(SensitiveDecisionError);
  });

  it("graph and verify work end to end", async () => {
    const g = ctx(["paul-graham"], {});
    expect(await runGraph(g)).toBe(0);
    expect(g.lines.join("\n")).toContain("naval-ravikant");
    const answer = join(dir, "a.md");
    writeFileSync(answer, 'I never said "harvesting is always the coward\'s way out" [paul-graham/q-000000].');
    const v = ctx([answer], { advisors: "paul-graham" });
    expect(await runVerify(v)).toBe(1);
    expect(v.lines[0]).toMatch(/^FAIL/);
  });
});
