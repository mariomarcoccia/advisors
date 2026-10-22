import { CachedJev } from "./cache.ts";
import { DEFAULT_JEV_MODEL, type Paths } from "./config.ts";
import { JevClient, JevConfigError } from "./jev.ts";
import { Bm25Scorer, JevFanoutScorer, JevPairScorer, type Scorer } from "./retrieve.ts";

export type ScorerKind = "auto" | "jev" | "jev-pair" | "bm25";

export const SCORER_KINDS: ScorerKind[] = ["auto", "jev", "jev-pair", "bm25"];

export interface ScorerContext {
  paths: Paths;
  env: NodeJS.ProcessEnv;
  warn: (message: string) => void;
}

export function jevModel(env: NodeJS.ProcessEnv): string {
  return env["COUNCIL_JEV_MODEL"] ?? DEFAULT_JEV_MODEL;
}

export function makeJev(ctx: ScorerContext): CachedJev {
  const apiKey = ctx.env["TYPESAFE_API_KEY"] ?? "";
  if (!apiKey) throw new JevConfigError("TYPESAFE_API_KEY is not set (create one at https://console.typesafe.ai/keys)");
  const model = jevModel(ctx.env);
  return new CachedJev(new JevClient({ apiKey, model }), ctx.paths.cacheDir, model);
}

// "auto" degrades to BM25 without a key so the skills keep working offline;
// an explicit "jev" fails loudly instead.
export function makeScorer(kind: ScorerKind, ctx: ScorerContext): Scorer {
  if (kind === "bm25") return new Bm25Scorer();
  if (kind === "auto" && !ctx.env["TYPESAFE_API_KEY"]) {
    ctx.warn("council: TYPESAFE_API_KEY not set; falling back to BM25 ranking (lower quality).");
    return new Bm25Scorer();
  }
  const jev = makeJev(ctx);
  return kind === "jev-pair" ? new JevPairScorer(jev) : new JevFanoutScorer(jev);
}

export function parseScorerKind(value: string | undefined): ScorerKind {
  const kind = (value ?? "auto") as ScorerKind;
  if (!SCORER_KINDS.includes(kind)) throw new JevConfigError(`unknown scorer "${value}"; use ${SCORER_KINDS.join("|")}`);
  return kind;
}
