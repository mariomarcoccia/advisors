#!/usr/bin/env node
import { parseArgs } from "node:util";
import { resolvePaths } from "./config.ts";
import { runCheck } from "./commands/check.ts";
import { runEval } from "./commands/eval.ts";
import { runGraph, runIndex, runLint, runStats } from "./commands/index-cmds.ts";
import { runJev } from "./commands/jev.ts";
import { runPack, runSelect } from "./commands/retrieval.ts";
import { runVerify } from "./commands/verify.ts";
import { UsageError, type CommandContext } from "./commands/types.ts";
import { SensitiveDecisionError } from "./decision.ts";
import { StaleIndexError } from "./indexer.ts";
import { JevApiError, JevConfigError } from "./jev.ts";
import { DossierFormatError } from "./parse.ts";

const USAGE = `council <command> [options]

  index [--check]                       rebuild index/ from advisors/ (--check: fail if stale)
  lint                                  validate every dossier (frontmatter, sections, counts)
  check <decision.en.md>                is this abstract anonymized, English, and decision-dense?
  stats                                 dossier vs. pack token footprint
  select --decision F [--k 5] [--tension T ...] [--exclude a,b]
                                        rank advisors and compose a board for a decision
  pack <slug...> --decision F [--budget 6000] [--out DIR]
                                        build decision-specific context packs
  graph <slug> [--json]                 documented disagreements for an advisor
  verify <answer.md> --advisors a,b     check quotes and card ids against the dossiers
  eval pool|run --targets F [--all]     retrieval evaluation (see evals/README.md)
  jev ping                              check the TypeSafe key and model

Common: --scorer auto|jev|jev-pair|bm25 (default auto) · --json · --allow-sensitive`;

const COMMANDS: Record<string, (ctx: CommandContext) => Promise<number>> = {
  check: runCheck,
  index: runIndex,
  lint: runLint,
  stats: runStats,
  select: runSelect,
  pack: runPack,
  graph: runGraph,
  verify: runVerify,
  eval: runEval,
  jev: runJev,
};

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      "decision": { type: "string" },
      "k": { type: "string" },
      "tension": { type: "string", multiple: true },
      "exclude": { type: "string" },
      "budget": { type: "string" },
      "out": { type: "string" },
      "scorer": { type: "string" },
      "scorers": { type: "string" },
      "advisors": { type: "string" },
      "min-words": { type: "string" },
      "targets": { type: "string" },
      "check": { type: "boolean" },
      "all": { type: "boolean" },
      "json": { type: "boolean" },
      "allow-sensitive": { type: "boolean" },
      "help": { type: "boolean", short: "h" },
    },
  });
  const [command, ...args] = positionals;
  const run = command ? COMMANDS[command] : undefined;
  if (!run || values.help) {
    process.stdout.write(`${USAGE}\n`);
    return run || values.help ? 0 : 2;
  }
  const ctx: CommandContext = {
    args,
    flags: values,
    paths: resolvePaths(),
    env: process.env,
    out: (text) => process.stdout.write(`${text}\n`),
    warn: (text) => process.stderr.write(`${text}\n`),
  };
  return run(ctx);
}

// Expected failures print one actionable line; anything else is a bug and keeps its stack.
const KNOWN_ERRORS = [UsageError, SensitiveDecisionError, StaleIndexError, JevApiError, JevConfigError, DossierFormatError];

async function entry(): Promise<number> {
  try {
    return await main(process.argv.slice(2));
  } catch (error) {
    if (!KNOWN_ERRORS.some((known) => error instanceof known)) throw error;
    process.stderr.write(`council: ${(error as Error).message}\n`);
    return 2;
  }
}

process.exitCode = await entry();
