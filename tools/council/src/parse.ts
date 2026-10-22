import { YAMLParseError, parse as parseYaml } from "yaml";
import { FrontmatterSchema, type Frontmatter } from "./schemas.ts";

export type BlockType = "bullet" | "para" | "row";

export interface Block {
  type: BlockType;
  text: string;
  heading?: string;
}

export interface Section {
  name: string;
  blocks: Block[];
}

export interface ParsedDossier {
  frontmatter: Frontmatter;
  sections: Section[];
  body: string;
}

export class DossierFormatError extends Error {
  override name = "DossierFormatError";
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;

export function splitFrontmatter(text: string): { yaml: string; body: string } {
  const match = FRONTMATTER.exec(text.replace(/\r\n/g, "\n"));
  if (!match) throw new DossierFormatError("missing YAML frontmatter");
  return { yaml: match[1] ?? "", body: match[2] ?? "" };
}

export function parseDossier(text: string): ParsedDossier {
  const { yaml, body } = splitFrontmatter(text);
  const result = FrontmatterSchema.safeParse(readYaml(yaml));
  if (!result.success) {
    throw new DossierFormatError(`invalid frontmatter: ${result.error.message}`);
  }
  return { frontmatter: result.data, sections: parseSections(body), body };
}

function readYaml(yaml: string): unknown {
  try {
    return parseYaml(yaml);
  } catch (error) {
    if (error instanceof YAMLParseError) {
      throw new DossierFormatError(`frontmatter is not valid YAML: ${error.message.split("\n")[0] ?? ""}`);
    }
    throw error;
  }
}

export function parseSections(body: string): Section[] {
  const sections: Section[] = [];
  let current: Section | undefined;
  let buffer: string[] = [];
  for (const line of body.split("\n")) {
    if (line.startsWith("## ")) {
      if (current) current.blocks = parseBlocks(buffer);
      current = { name: line.slice(3).trim(), blocks: [] };
      sections.push(current);
      buffer = [];
    } else if (current) {
      buffer.push(line);
    }
  }
  if (current) current.blocks = parseBlocks(buffer);
  return sections;
}

type LineKind = "blank" | "h3" | "bullet" | "nested" | "row" | "rule" | "text";

function classify(line: string): LineKind {
  if (!line.trim()) return "blank";
  if (line.startsWith("### ")) return "h3";
  if (/^[-*] /.test(line) || /^\d+\. /.test(line)) return "bullet";
  if (/^\s+([-*]|\d+\.) /.test(line)) return "nested";
  if (/^\|\s*:?-{3,}/.test(line)) return "rule";
  if (line.startsWith("|")) return "row";
  return "text";
}

interface BlockState {
  blocks: Block[];
  open: Block | undefined;
  openNumbered: boolean;
  heading: string | undefined;
  afterBlank: boolean;
  tableHeaderPending: boolean;
}

// Turns a section's lines into blocks: one per top-level bullet (nested bullets and
// wrapped lines fold into their parent), one per table row, one per paragraph.
export function parseBlocks(lines: string[]): Block[] {
  const state: BlockState = {
    blocks: [],
    open: undefined,
    openNumbered: false,
    heading: undefined,
    afterBlank: false,
    tableHeaderPending: true,
  };
  for (const line of lines) consumeLine(state, classify(line), line);
  return state.blocks.filter((block) => block.text.length > 0);
}

function consumeLine(state: BlockState, kind: LineKind, line: string): void {
  if (kind === "blank") {
    state.afterBlank = true;
    state.tableHeaderPending = true;
    return;
  }
  if (kind === "h3" || kind === "rule") {
    if (kind === "h3") state.heading = line.slice(4).trim();
    state.open = undefined;
    state.tableHeaderPending = false;
    return;
  }
  if (kind === "row" && state.tableHeaderPending) {
    state.tableHeaderPending = false;
    return;
  }
  appendLine(state, kind, line);
  state.afterBlank = false;
  state.tableHeaderPending = false;
}

// A wrapped line that happens to start with "2019. " is a continuation, not a
// numbered item: numbers only open an item after a blank line or another item.
function demoteFalseNumbering(state: BlockState, kind: LineKind, line: string): LineKind {
  const numbered = /^\d+\. /.test(line);
  if (kind !== "bullet" || !numbered || !state.open || state.afterBlank || state.openNumbered) return kind;
  return "text";
}

function appendLine(state: BlockState, rawKind: LineKind, line: string): void {
  const kind = demoteFalseNumbering(state, rawKind, line);
  const open = state.open;
  const continues =
    open !== undefined &&
    (kind === "nested" ? open.type === "bullet" : kind === "text" && !state.afterBlank && open.type !== "row");
  if (continues) {
    open.text = `${open.text}\n${stripBlockquote(line.trim())}`;
    return;
  }
  const type: BlockType = kind === "row" ? "row" : kind === "text" ? "para" : "bullet";
  const block: Block = { type, text: cleanLine(kind, line) };
  if (state.heading) block.heading = state.heading;
  state.blocks.push(block);
  state.open = block;
  state.openNumbered = kind === "bullet" && /^\d+\. /.test(line);
}

function stripBlockquote(text: string): string {
  return text.replace(/^>\s?/, "");
}

function cleanLine(kind: LineKind, line: string): string {
  if (kind === "row") {
    return line
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean)
      .join(" | ");
  }
  return stripBlockquote(line.trim()).replace(/^\s*([-*]|\d+\.)\s+/, "").trim();
}
