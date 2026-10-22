import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Placeholders the engine fills in prompts; anything else would reach the model raw.
const ALLOWED_PLACEHOLDERS = new Set(["PERSON", "DATE"]);

export const SpecSchema = z
  .object({
    slug: z.string().regex(SLUG),
    name: z.string().min(1),
    lang: z.enum(["en", "pt"]),
    corpus: z.enum(["thin", "normal", "large"]),
    person: z.string().min(20),
    example: z.string().regex(SLUG).optional(),
    notes: z
      .object({ focus: z.string().min(10).optional(), attribution: z.string().min(10).optional() })
      .strict()
      .optional(),
    enumPrompts: z
      .array(z.object({ label: z.string().regex(SLUG), prompt: z.string().min(40) }).strict())
      .min(1)
      .optional(),
  })
  .strict();
export type Spec = z.infer<typeof SpecSchema>;

export class SpecError extends Error {
  override name = "SpecError";
}

export function parseSpec(fileName: string, text: string): Spec {
  const result = SpecSchema.safeParse(parseJson(fileName, text));
  if (!result.success) throw new SpecError(`${fileName}: ${result.error.message}`);
  const spec = result.data;
  if (`${spec.slug}.json` !== fileName) throw new SpecError(`${fileName}: slug "${spec.slug}" does not match the file name`);
  const unknown = unknownPlaceholders(spec);
  if (unknown.length > 0) throw new SpecError(`${fileName}: unknown placeholders ${unknown.join(", ")} (use {{PERSON}} or {{DATE}})`);
  return spec;
}

function parseJson(fileName: string, text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) throw new SpecError(`${fileName}: invalid JSON (${error.message})`);
    throw error;
  }
}

function unknownPlaceholders(spec: Spec): string[] {
  const text = (spec.enumPrompts ?? []).map((p) => p.prompt).join("\n");
  const names = [...text.matchAll(/\{\{(\w+)\}\}|\$\{(\w+)\}/g)].map((m) => m[1] ?? `\${${m[2] ?? ""}}`);
  return [...new Set(names.filter((name) => !ALLOWED_PLACEHOLDERS.has(name)))];
}

export function loadSpecs(specsDir: string): Spec[] {
  return readdirSync(specsDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => parseSpec(file, readFileSync(join(specsDir, file), "utf8")));
}

// Every dossier needs a spec (so it can be rebuilt) and every spec needs a
// dossier or an explicit plan to create one; `example` must point at a dossier.
export function coverageProblems(specs: Spec[], dossierSlugs: string[]): string[] {
  const specSlugs = new Set(specs.map((spec) => spec.slug));
  const dossiers = new Set(dossierSlugs);
  const problems = dossierSlugs.filter((slug) => !specSlugs.has(slug)).map((slug) => `advisors/${slug}.md has no pipeline/specs/${slug}.json`);
  for (const spec of specs) {
    if (!dossiers.has(spec.slug)) problems.push(`specs/${spec.slug}.json has no dossier yet (fine before a first "create" run)`);
    if (spec.example && !dossiers.has(spec.example)) problems.push(`specs/${spec.slug}.json: example "${spec.example}" is not a dossier`);
  }
  return problems;
}
