import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { z } from "zod";
import { readDecision } from "../decision.ts";
import { LabelSetSchema, meanMetrics, metricsFor, pool, type Metrics } from "../evaluate.ts";
import { loadFreshIndex, type CouncilIndex } from "../indexer.ts";
import { CARD_RELEVANCE, type Scorer } from "../retrieve.ts";
import { makeScorer, parseScorerKind } from "../scorers.ts";
import { listFlag, requireFlag, UsageError, type CommandContext } from "./types.ts";

const TargetsSchema = z.array(z.object({ decision: z.string(), advisors: z.array(z.string()).min(1) }));

interface Target {
  decisionId: string;
  decisionPath: string;
  advisor: string;
}

const POOL_DEPTH = 15;
const RANKED_KINDS = new Set(["core_idea", "mental_model", "heuristic", "position", "quote", "disagreement", "blind_spot", "book", "other"]);

export async function runEval(ctx: CommandContext): Promise<number> {
  const mode = ctx.args[0];
  if (mode !== "pool" && mode !== "run") throw new UsageError("usage: council eval pool|run --targets F [--scorers a,b]");
  const targetsPath = resolve(requireFlag(ctx.flags.targets, "targets"));
  const targets = loadTargets(targetsPath);
  const index = loadFreshIndex(ctx.paths.indexDir, ctx.paths.advisorsDir);
  const kinds = ctx.flags.all && mode === "pool" ? [] : listFlag(ctx.flags.scorers ?? "bm25,jev");
  const scorers = kinds.map((kind) => makeScorer(parseScorerKind(kind), ctx));
  const evalDir = dirname(targetsPath);
  return mode === "pool" ? writePools(ctx, evalDir, targets, index, scorers) : report(ctx, evalDir, targets, index, scorers);
}

function loadTargets(path: string): Target[] {
  const base = dirname(path);
  return TargetsSchema.parse(JSON.parse(readFileSync(path, "utf8"))).flatMap((t) =>
    t.advisors.map((advisor) => ({
      decisionId: basename(t.decision).replace(/\.md$/, ""),
      decisionPath: resolve(base, t.decision),
      advisor,
    })),
  );
}

function rankableCards(index: CouncilIndex, target: Target): CouncilIndex["cards"] {
  return index.cards.filter((c) => c.advisor === target.advisor && RANKED_KINDS.has(c.kind));
}

async function rank(index: CouncilIndex, target: Target, scorer: Scorer): Promise<string[]> {
  const cards = rankableCards(index, target);
  if (cards.length === 0) throw new UsageError(`no rankable cards for advisor "${target.advisor}"`);
  const items = cards.map((card) => ({ id: card.id, material: card.text }));
  const scores = await scorer.score(readDecision(target.decisionPath), items, CARD_RELEVANCE);
  return [...scores].sort((a, b) => b[1] - a[1]).map(([id]) => id);
}

const poolFile = (evalDir: string, dir: string, t: Target): string => join(evalDir, dir, `${t.decisionId}__${t.advisor}.json`);

async function writePools(ctx: CommandContext, evalDir: string, targets: Target[], index: CouncilIndex, scorers: Scorer[]): Promise<number> {
  mkdirSync(join(evalDir, "pools"), { recursive: true });
  for (const target of targets) {
    const ids = ctx.flags.all
      ? rankableCards(index, target).map((card) => card.id)
      : pool(await Promise.all(scorers.map((scorer) => rank(index, target, scorer))), POOL_DEPTH);
    const candidates = ids.map((id) => index.cards.find((card) => card.id === id)).filter((card) => card !== undefined);
    const payload = {
      decision: target.decisionId,
      advisor: target.advisor,
      decisionText: readDecision(target.decisionPath),
      candidates: candidates.map((card) => ({ id: card.id, kind: card.kind, text: card.text })),
    };
    writeFileSync(poolFile(evalDir, "pools", target), `${JSON.stringify(payload, null, 2)}\n`);
    ctx.out(`pool ${target.decisionId} × ${target.advisor}: ${candidates.length} candidates`);
  }
  return 0;
}

async function report(ctx: CommandContext, evalDir: string, targets: Target[], index: CouncilIndex, scorers: Scorer[]): Promise<number> {
  const labeled = targets.filter((t) => existsSync(poolFile(evalDir, "labels", t)));
  if (labeled.length === 0) throw new UsageError(`no label files in ${join(evalDir, "labels")}; run \`eval pool\` and label first`);
  const rows: string[] = ["| scorer | nDCG@10 | recall@20 | P@10 | pairs |", "|---|---|---|---|---|"];
  for (const scorer of scorers) {
    const metrics: Metrics[] = [];
    for (const target of labeled) {
      const labels = LabelSetSchema.parse(JSON.parse(readFileSync(poolFile(evalDir, "labels", target), "utf8"))).labels;
      metrics.push(metricsFor(await rank(index, target, scorer), labels));
    }
    const m = meanMetrics(metrics);
    rows.push(`| ${scorer.name} | ${m.ndcg10.toFixed(3)} | ${m.recall20.toFixed(3)} | ${m.precision10.toFixed(3)} | ${metrics.length} |`);
  }
  ctx.out(rows.join("\n"));
  if (labeled.length < targets.length) ctx.warn(`${targets.length - labeled.length} target(s) skipped: no labels yet`);
  return 0;
}
