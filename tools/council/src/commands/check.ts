import { findSensitive, readDecision } from "../decision.ts";
import { countWords } from "../text.ts";
import { UsageError, type CommandContext } from "./types.ts";

const MIN_WORDS = 60;
const MAX_WORDS = 450;

// `council check <decision.en.md>`: is this abstract safe and useful to send to Jev?
export async function runCheck(ctx: CommandContext): Promise<number> {
  const path = ctx.args[0];
  if (!path) throw new UsageError("usage: council check <decision.en.md>");
  const decision = readDecision(path);
  const problems = findSensitive(decision).map((hit) => `sensitive ${hit.kind}: "${hit.sample}"`);
  const words = countWords(decision);
  if (words < MIN_WORDS) problems.push(`too short (${words} words): retrieval needs the options, constraints and leaning`);
  if (words > MAX_WORDS) problems.push(`too long (${words} words): trim background that would not change the advice`);
  if (/[À-ÿ]{2,}|\b(não|você|empresa|decisão)\b/i.test(decision)) problems.push("looks non-English: write the abstract in English");
  ctx.out(problems.length === 0 ? `ok (${words} words)` : problems.map((p) => `- ${p}`).join("\n"));
  return problems.length === 0 ? 0 : 1;
}
