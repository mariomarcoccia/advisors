import {
  buildIndex,
  dossierHash,
  loadFreshIndex,
  loadIndex,
  readDossierFiles,
  writeIndex,
} from "../indexer.ts";
import { lintDossiers } from "../lint.ts";
import { dissenters } from "../select.ts";
import { UsageError, type CommandContext } from "./types.ts";

export async function runIndex(ctx: CommandContext): Promise<number> {
  const files = readDossierFiles(ctx.paths.advisorsDir);
  if (ctx.flags.check) {
    const fresh = loadIndex(ctx.paths.indexDir).manifest.dossierHash === dossierHash(files);
    ctx.out(fresh ? "index is up to date" : "index is STALE: run `council index`");
    return fresh ? 0 : 1;
  }
  const index = buildIndex(files);
  writeIndex(ctx.paths.indexDir, index);
  const m = index.manifest;
  ctx.out(`indexed ${m.advisors} advisors · ${m.cards} cards · ${m.edges} disagreement edges → ${ctx.paths.indexDir}`);
  return 0;
}

export async function runLint(ctx: CommandContext): Promise<number> {
  const issues = lintDossiers(readDossierFiles(ctx.paths.advisorsDir));
  if (ctx.flags.json) ctx.out(JSON.stringify(issues, null, 2));
  else for (const issue of issues) ctx.out(`${issue.level.toUpperCase()} ${issue.slug}: ${issue.message}`);
  const errors = issues.filter((issue) => issue.level === "error").length;
  if (!ctx.flags.json) ctx.out(`${errors} error(s), ${issues.length - errors} warning(s)`);
  return errors > 0 ? 1 : 0;
}

export async function runStats(ctx: CommandContext): Promise<number> {
  const index = loadFreshIndex(ctx.paths.indexDir, ctx.paths.advisorsDir);
  const total = index.advisors.reduce((sum, a) => sum + a.dossierTokens, 0);
  const summaries = index.advisors.reduce((sum, a) => sum + Math.ceil(a.summary.length / 4), 0);
  const sorted = [...index.advisors].sort((a, b) => b.dossierTokens - a.dossierTokens);
  ctx.out(`advisors: ${index.advisors.length} · cards: ${index.cards.length} · corpus: ~${total} tokens`);
  ctx.out(`selection by reading every Summary: ~${summaries} tokens`);
  ctx.out(`largest dossiers: ${sorted.slice(0, 5).map((a) => `${a.slug} ~${a.dossierTokens}`).join(", ")}`);
  ctx.out(`mean dossier: ~${Math.round(total / Math.max(index.advisors.length, 1))} tokens (a full-load consult)`);
  return 0;
}

export async function runGraph(ctx: CommandContext): Promise<number> {
  const slug = ctx.args[0];
  if (!slug) throw new UsageError("usage: council graph <slug>");
  const index = loadFreshIndex(ctx.paths.indexDir, ctx.paths.advisorsDir);
  if (!index.advisors.some((a) => a.slug === slug)) throw new UsageError(`unknown advisor "${slug}"`);
  const rows = dissenters(slug, index.edges);
  if (ctx.flags.json) {
    ctx.out(JSON.stringify(rows, null, 2));
    return 0;
  }
  for (const row of rows) {
    ctx.out(`- ${row.slug} (${row.cardIds.length} documented): ${row.labels[0] ?? ""} [${row.cardIds.join("] [")}]`);
  }
  if (rows.length === 0) ctx.out(`no documented disagreements between ${slug} and other council members`);
  return 0;
}
