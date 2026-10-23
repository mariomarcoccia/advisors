import type { Block, ParsedDossier, Section } from "./parse.ts";
import type { Card, CardKind } from "./schemas.ts";
import { estimateTokens, extractQuotes, shortHash } from "./text.ts";

const SECTION_KINDS: Record<string, CardKind> = {
  "Summary": "summary",
  "Bio": "bio",
  "Core ideas": "core_idea",
  "Mental models": "mental_model",
  "Decision heuristics": "heuristic",
  "Positions by decision type": "position",
  "Signature quotes": "quote",
  "Voice & style": "voice",
  "Where they disagree": "disagreement",
  "Blind spots": "blind_spot",
  "Provenance notes": "provenance",
  "Books distilled": "book",
};

// Sections that are read whole: they describe the advisor rather than a position,
// so splitting them would only make the pack lose the voice.
const WHOLE_SECTION_KINDS = new Set<CardKind>(["summary", "bio", "voice"]);

const KIND_PREFIX: Record<CardKind, string> = {
  summary: "sum",
  bio: "bio",
  core_idea: "ci",
  mental_model: "mm",
  heuristic: "dh",
  position: "pos",
  quote: "q",
  voice: "voice",
  disagreement: "dis",
  blind_spot: "bs",
  provenance: "prov",
  book: "book",
  other: "x",
};

// Paragraphs this short that open a list section are editorial preambles
// ("Each model carries a sourced example..."), not positions.
const PREAMBLE_MAX_CHARS = 220;

export function kindForSection(name: string): CardKind {
  return SECTION_KINDS[name] ?? "other";
}

export function buildCards(dossier: ParsedDossier): Card[] {
  const slug = dossier.frontmatter.slug;
  const ids = new Set<string>();
  return dossier.sections.flatMap((section) =>
    sectionUnits(section).map((unit) => makeCard(slug, section.name, unit, ids)),
  );
}

interface Unit {
  text: string;
  heading?: string;
}

function sectionUnits(section: Section): Unit[] {
  const kind = kindForSection(section.name);
  if (WHOLE_SECTION_KINDS.has(kind)) {
    const text = section.blocks.map((block) => block.text).join("\n");
    return text ? [{ text }] : [];
  }
  return section.blocks.filter((block, index) => !isPreamble(block, index)).map(toUnit);
}

function isPreamble(block: Block, index: number): boolean {
  return block.type === "para" && index === 0 && block.text.length <= PREAMBLE_MAX_CHARS;
}

function toUnit(block: Block): Unit {
  return block.heading ? { text: block.text, heading: block.heading } : { text: block.text };
}

function makeCard(slug: string, section: string, unit: Unit, ids: Set<string>): Card {
  const kind = kindForSection(section);
  const text = unit.heading ? `[${unit.heading}] ${unit.text}` : unit.text;
  const id = uniqueId(`${slug}/${KIND_PREFIX[kind]}-${shortHash(text)}`, ids);
  const card: Card = {
    id,
    advisor: slug,
    kind,
    section,
    text,
    quotes: extractQuotes(text),
    tokens: estimateTokens(text),
  };
  const title = leadTitle(unit.text);
  if (title) card.title = title;
  return card;
}

function uniqueId(base: string, ids: Set<string>): string {
  let id = base;
  for (let n = 2; ids.has(id); n += 1) id = `${base}-${n}`;
  ids.add(id);
  return id;
}

// The bold lead of a bullet ("**Default alive vs. default dead**") is its title.
export function leadTitle(text: string): string | undefined {
  const match = /^\*\*(.+?)\*\*/.exec(text);
  return match?.[1]?.replace(/[.:\s]+$/, "").trim() || undefined;
}
