import { buildCards, kindForSection } from "./cards.ts";
import { DossierFormatError, parseDossier, type ParsedDossier } from "./parse.ts";
import type { DossierFile } from "./indexer.ts";

export interface LintIssue {
  slug: string;
  level: "error" | "warning";
  message: string;
}

const REQUIRED_SECTIONS = [
  "Summary",
  "Bio",
  "Core ideas",
  "Mental models",
  "Decision heuristics",
  "Positions by decision type",
  "Signature quotes",
  "Voice & style",
  "Where they disagree",
  "Blind spots",
  "Provenance notes",
];

export function lintDossiers(files: DossierFile[]): LintIssue[] {
  return files.flatMap(lintFile);
}

function lintFile(file: DossierFile): LintIssue[] {
  const parsed = safeParse(file);
  if (parsed instanceof DossierFormatError) {
    return [{ slug: file.slug, level: "error", message: parsed.message }];
  }
  return lintParsed(file.slug, parsed);
}

function safeParse(file: DossierFile): ParsedDossier | DossierFormatError {
  try {
    return parseDossier(file.text);
  } catch (error) {
    if (error instanceof DossierFormatError) return error;
    throw error;
  }
}

export function lintParsed(fileSlug: string, dossier: ParsedDossier): LintIssue[] {
  const fm = dossier.frontmatter;
  const issues: LintIssue[] = [];
  const add = (level: LintIssue["level"], message: string): void => {
    issues.push({ slug: fileSlug, level, message });
  };
  if (fm.slug !== fileSlug) add("error", `frontmatter slug "${fm.slug}" does not match file name`);
  if (fm.source_count !== fm.sources.length) {
    add("error", `source_count ${fm.source_count} != ${fm.sources.length} sources listed`);
  }
  const urls = fm.sources.map((source) => source.url);
  const duplicates = urls.filter((url, i) => urls.indexOf(url) !== i);
  if (duplicates.length > 0) add("warning", `duplicate source URLs: ${[...new Set(duplicates)].join(", ")}`);
  const names = dossier.sections.map((section) => section.name);
  for (const missing of REQUIRED_SECTIONS.filter((name) => !names.includes(name))) {
    add("error", `missing section "## ${missing}"`);
  }
  for (const unknown of names.filter((name) => kindForSection(name) === "other")) {
    add("warning", `unknown section "## ${unknown}" (indexed as kind "other")`);
  }
  if (buildCards(dossier).filter((card) => card.kind !== "provenance").length < 10) {
    add("warning", "fewer than 10 retrievable cards; dossier may be too thin for packing");
  }
  return issues;
}
