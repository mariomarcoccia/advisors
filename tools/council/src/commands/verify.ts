import { readFileSync } from "node:fs";
import { loadFreshIndex } from "../indexer.ts";
import { renderReport, verifyAnswer } from "../verify.ts";
import { intFlag, listFlag, UsageError, type CommandContext } from "./types.ts";

export async function runVerify(ctx: CommandContext): Promise<number> {
  const path = ctx.args[0];
  if (!path) throw new UsageError("usage: council verify <answer.md> --advisors a,b");
  const advisors = listFlag(ctx.flags.advisors);
  if (advisors.length === 0) throw new UsageError("missing --advisors (the advisors the answer speaks for)");
  const index = loadFreshIndex(ctx.paths.indexDir, ctx.paths.advisorsDir);
  const unknown = advisors.filter((slug) => !index.advisors.some((a) => a.slug === slug));
  if (unknown.length > 0) throw new UsageError(`unknown advisor(s): ${unknown.join(", ")}`);
  const report = verifyAnswer(readFileSync(path, "utf8"), index.cards, {
    advisors,
    minQuoteWords: intFlag(ctx.flags["min-words"], 4),
  });
  ctx.out(ctx.flags.json ? JSON.stringify(report, null, 2) : renderReport(report));
  return report.ok ? 0 : 1;
}
