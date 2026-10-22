import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Pinned, not `jev-latest`: an alias move would silently shift every relevance
// threshold we tuned. Bump deliberately after re-running `council eval`.
export const DEFAULT_JEV_MODEL = "jev-1.13.0";
export const JEV_BASE_URL = "https://api.typesafe.ai";

// Default request budget stays well under Jev's 64k per-request context, leaving
// room for the state and question scaffolding.
export const JEV_REQUEST_TOKEN_BUDGET = 40_000;

export interface Paths {
  repoRoot: string;
  advisorsDir: string;
  indexDir: string;
  home: string;
  stateDir: string;
  cacheDir: string;
}

const HERE = dirname(fileURLToPath(import.meta.url));

export function resolvePaths(env: NodeJS.ProcessEnv = process.env): Paths {
  const repoRoot = resolve(HERE, "..", "..", "..");
  const home = env["ADVISORS_HOME"] ?? join(homedir(), ".advisors");
  return {
    repoRoot,
    advisorsDir: env["ADVISORS_DIR"] ?? join(repoRoot, "advisors"),
    indexDir: env["ADVISORS_INDEX_DIR"] ?? join(repoRoot, "index"),
    home,
    stateDir: join(home, "state"),
    cacheDir: join(home, "cache", "jev"),
  };
}
