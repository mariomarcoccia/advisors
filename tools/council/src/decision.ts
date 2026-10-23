import { readFileSync } from "node:fs";

export interface SensitiveHit {
  kind: string;
  sample: string;
}

// The decision state leaves the machine when Jev scores it, so it must be the
// anonymized English abstract /frame writes, never the raw brief.
const SENSITIVE_PATTERNS: [string, RegExp][] = [
  ["email", /[\w.+-]+@[\w-]+\.[\w.]+/],
  ["currency amount", /(R\$|US\$|\$|€|£)\s?\d/],
  ["brazilian tax id", /\b\d{2,3}\.\d{3}\.\d{3}[/-]\d{2,4}(-\d{2})?\b/],
  ["phone number", /\+?\d{2}\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}\b/],
  ["url", /https?:\/\/\S+/],
];

export function findSensitive(text: string): SensitiveHit[] {
  return SENSITIVE_PATTERNS.flatMap(([kind, pattern]) => {
    const match = pattern.exec(text);
    return match ? [{ kind, sample: match[0] }] : [];
  });
}

export class SensitiveDecisionError extends Error {
  override name = "SensitiveDecisionError";
}

// Strips a YAML frontmatter block if present; the body is the decision state.
export function readDecision(path: string): string {
  const text = readFileSync(path, "utf8");
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
  if (!body) throw new SensitiveDecisionError(`decision file ${path} is empty`);
  return body;
}

export function assertShareable(decision: string, allowSensitive: boolean): void {
  const hits = findSensitive(decision);
  if (hits.length === 0 || allowSensitive) return;
  const list = hits.map((hit) => `${hit.kind} ("${hit.sample}")`).join(", ");
  throw new SensitiveDecisionError(
    `decision looks like it contains sensitive data: ${list}. Rewrite it as an anonymized abstract (buckets, roles, no names or amounts) or pass --allow-sensitive.`,
  );
}
