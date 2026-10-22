import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { assertShareable, readDecision } from "../decision.ts";
import { loadFreshIndex, type CouncilIndex } from "../indexer.ts";
import { buildPack, DEFAULT_PACK, renderPack } from "../pack.ts";
import { composeBoard, scoreAdvisors } from "../select.ts";
import { makeScorer, parseScorerKind } from "../scorers.ts";
import type { Scorer } from "../retrieve.ts";
import { intFlag, listFlag, requireFlag, UsageError, type CommandContext } from "./types.ts";

interface Prepared {
  index: CouncilIndex;
  decision: string;
  scorer: Scorer;
}

function prepare(ctx: CommandContext): Prepared {
  const index = loadFreshIndex(ctx.paths.indexDir, ctx.paths.advisorsDir);
  const decision = readDecision(requireFlag(ctx.flags.decision, "decision"));
  const scorer = makeScorer(parseScorerKind(ctx.flags.scorer), ctx);
  if (scorer.name !== "bm25") assertShareable(decision, ctx.flags["allow-sensitive"] ?? false);
  return { index, decision, scorer };
}

export async function runSelect(ctx: CommandContext): Promise<number> {
  const { index, decision, scorer } = prepare(ctx);
  const tensions = ctx.flags.tension ?? [];
  const scores = await scoreAdvisors(decision, index.advisors, scorer, tensions);
  const board = composeBoard(scores, index.edges, {
    k: intFlag(ctx.flags.k, 5),
    tensions,
    exclude: listFlag(ctx.flags.exclude),
  });
  if (ctx.flags.json) {
    ctx.out(JSON.stringify({ scorer: scorer.name, board, ranking: scores }, null, 2));
    return 0;
  }
  ctx.out(`scorer: ${scorer.name}`);
  ctx.out("## Recommended board");
  board.forEach((pick, i) => ctx.out(`${i + 1}. ${pick.name} (${pick.slug}): ${pick.reason}`));
  ctx.out("\n## Next most relevant");
  const seated = new Set(board.map((pick) => pick.slug));
  for (const s of scores.filter((x) => !seated.has(x.slug)).slice(0, 8)) {
    ctx.out(`- ${s.name} (${s.slug}): ${s.relevance.toFixed(2)}`);
  }
  return 0;
}

export async function runPack(ctx: CommandContext): Promise<number> {
  const { index, decision, scorer } = prepare(ctx);
  if (ctx.args.length === 0) throw new UsageError("usage: council pack <slug...> --decision F");
  const options = { ...DEFAULT_PACK, budget: intFlag(ctx.flags.budget, DEFAULT_PACK.budget) };
  for (const slug of ctx.args) {
    const advisor = index.advisors.find((a) => a.slug === slug);
    if (!advisor) throw new UsageError(`unknown advisor "${slug}"`);
    const pack = await buildPack(advisor, index.cards, decision, scorer, options);
    emitPack(ctx, slug, renderPack(pack), pack.tokens);
  }
  return 0;
}

function emitPack(ctx: CommandContext, slug: string, rendered: string, tokens: number): void {
  const outDir = ctx.flags.out;
  if (!outDir) {
    ctx.out(rendered);
    return;
  }
  mkdirSync(outDir, { recursive: true });
  const path = join(outDir, `${slug}.md`);
  writeFileSync(path, `${rendered}\n`);
  ctx.out(`${path} (~${tokens} tokens)`);
}
