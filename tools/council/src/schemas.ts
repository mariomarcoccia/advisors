import { z } from "zod";

export const SourceSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
});

export const FrontmatterSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  role: z.string().min(1),
  domains: z.array(z.string().min(1)).min(1),
  last_updated: z.union([z.string(), z.date()]).transform((value) =>
    value instanceof Date ? value.toISOString().slice(0, 10) : value,
  ),
  source_count: z.number().int().nonnegative(),
  sources: z.array(SourceSchema),
});
export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export const CARD_KINDS = [
  "summary",
  "bio",
  "core_idea",
  "mental_model",
  "heuristic",
  "position",
  "quote",
  "voice",
  "disagreement",
  "blind_spot",
  "provenance",
  "book",
  "other",
] as const;
export const CardKindSchema = z.enum(CARD_KINDS);
export type CardKind = z.infer<typeof CardKindSchema>;

export const CardSchema = z.object({
  id: z.string().min(1),
  advisor: z.string().min(1),
  kind: CardKindSchema,
  section: z.string().min(1),
  title: z.string().optional(),
  text: z.string().min(1),
  quotes: z.array(z.string()),
  tokens: z.number().int().positive(),
});
export type Card = z.infer<typeof CardSchema>;

export const AdvisorEntrySchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  domains: z.array(z.string()),
  summary: z.string(),
  sourceCount: z.number().int(),
  lastUpdated: z.string(),
  dossierTokens: z.number().int(),
  cardCount: z.number().int(),
});
export type AdvisorEntry = z.infer<typeof AdvisorEntrySchema>;

export const GraphEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  external: z.boolean(),
  label: z.string(),
  cardId: z.string(),
});
export type GraphEdge = z.infer<typeof GraphEdgeSchema>;

export const IndexManifestSchema = z.object({
  version: z.literal(1),
  dossierHash: z.string(),
  advisors: z.number().int(),
  cards: z.number().int(),
  edges: z.number().int(),
});
export type IndexManifest = z.infer<typeof IndexManifestSchema>;
