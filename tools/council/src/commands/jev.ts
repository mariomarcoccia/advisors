import { makeJevClient } from "../scorers.ts";
import { UsageError, type CommandContext } from "./types.ts";

// `council jev ping`: one tiny request that proves the key, the endpoint, and the
// pinned model all work, and reports which versioned model answered.
export async function runJev(ctx: CommandContext): Promise<number> {
  if (ctx.args[0] !== "ping") throw new UsageError("usage: council jev ping");
  // Uncached on purpose: ping must prove the key works right now.
  const jev = makeJevClient(ctx);
  const started = performance.now();
  const response = await jev.systemOne({
    state: "Our checkout keeps failing for every customer since this morning.",
    questions: { urgent: { type: "noul", instructions: "The message reports an urgent problem." } },
  });
  const ms = Math.round(performance.now() - started);
  const answer = response.answers["urgent"];
  const value = answer?.type === "noul" ? answer.noul.toFixed(2) : "n/a";
  ctx.out(`ok · model ${response.model} · noul(urgent)=${value} · ${ms} ms · ${response.usage.input_tokens} input tokens`);
  return 0;
}
