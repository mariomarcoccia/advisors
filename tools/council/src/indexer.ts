import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { buildCards } from "./cards.ts";
import { buildGraph } from "./graph.ts";
import { parseDossier, type ParsedDossier } from "./parse.ts";
import {
  AdvisorEntrySchema,
  CardSchema,
  GraphEdgeSchema,
  IndexManifestSchema,
  type AdvisorEntry,
  type Card,
  type GraphEdge,
  type IndexManifest,
} from "./schemas.ts";
import { estimateTokens, shortHash } from "./text.ts";

export interface CouncilIndex {
  manifest: IndexManifest;
  advisors: AdvisorEntry[];
  cards: Card[];
  edges: GraphEdge[];
}

export interface DossierFile {
  slug: string;
  path: string;
  text: string;
}

export class StaleIndexError extends Error {
  override name = "StaleIndexError";
}

export function readDossierFiles(advisorsDir: string): DossierFile[] {
  return readdirSync(advisorsDir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const path = join(advisorsDir, file);
      return { slug: file.replace(/\.md$/, ""), path, text: readFileSync(path, "utf8") };
    });
}

export function dossierHash(files: DossierFile[]): string {
  return shortHash(files.map((file) => `${file.slug}\n${file.text}`).join("\n\u0000\n"), 16);
}

export function buildIndex(files: DossierFile[]): CouncilIndex {
  const parsed = files.map((file) => parseDossier(file.text));
  const cards = parsed.flatMap(buildCards);
  const advisors = parsed.map((dossier) => advisorEntry(dossier, cards));
  const edges = buildGraph(cards, advisors);
  const manifest: IndexManifest = {
    version: 1,
    dossierHash: dossierHash(files),
    advisors: advisors.length,
    cards: cards.length,
    edges: edges.length,
  };
  return { manifest, advisors, cards, edges };
}

function advisorEntry(dossier: ParsedDossier, cards: Card[]): AdvisorEntry {
  const fm = dossier.frontmatter;
  const summary = dossier.sections.find((section) => section.name === "Summary");
  return {
    slug: fm.slug,
    name: fm.name,
    role: fm.role,
    domains: fm.domains,
    summary: summary?.blocks.map((block) => block.text).join(" ") ?? "",
    sourceCount: fm.source_count,
    lastUpdated: fm.last_updated,
    dossierTokens: estimateTokens(dossier.body),
    cardCount: cards.filter((card) => card.advisor === fm.slug).length,
  };
}

export function writeIndex(indexDir: string, index: CouncilIndex): void {
  mkdirSync(indexDir, { recursive: true });
  const cardLines = index.cards.map((card) => JSON.stringify(card)).join("\n");
  writeFileSync(join(indexDir, "cards.jsonl"), `${cardLines}\n`);
  writeFileSync(join(indexDir, "advisors.json"), `${JSON.stringify(index.advisors, null, 2)}\n`);
  writeFileSync(join(indexDir, "graph.json"), `${JSON.stringify(index.edges, null, 2)}\n`);
  writeFileSync(join(indexDir, "manifest.json"), `${JSON.stringify(index.manifest, null, 2)}\n`);
}

export function loadIndex(indexDir: string): CouncilIndex {
  const read = (file: string): string => readFileSync(join(indexDir, file), "utf8");
  const cards = read("cards.jsonl")
    .split("\n")
    .filter(Boolean)
    .map((line) => CardSchema.parse(JSON.parse(line)));
  return {
    manifest: IndexManifestSchema.parse(JSON.parse(read("manifest.json"))),
    advisors: z.array(AdvisorEntrySchema).parse(JSON.parse(read("advisors.json"))),
    cards,
    edges: z.array(GraphEdgeSchema).parse(JSON.parse(read("graph.json"))),
  };
}

// Skills call this: a stale index would serve cards that no longer match the
// dossiers, which breaks citation verification.
export function loadFreshIndex(indexDir: string, advisorsDir: string): CouncilIndex {
  const index = loadIndex(indexDir);
  const current = dossierHash(readDossierFiles(advisorsDir));
  if (index.manifest.dossierHash !== current) {
    throw new StaleIndexError("index/ is out of date with advisors/; run `council index`");
  }
  return index;
}
