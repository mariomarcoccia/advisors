import { z } from "zod";
import { JEV_BASE_URL } from "./config.ts";

export interface NoulQuestion {
  type: "noul";
  instructions: string | Record<string, unknown>;
  criteria?: { true: string; false: string };
}

export interface ChoiceQuestion {
  type: "choice";
  instructions: string | Record<string, unknown>;
  criteria: Record<string, string>;
}

export type JevQuestion = NoulQuestion | ChoiceQuestion;

export interface JevRequest {
  state: string | Record<string, unknown>;
  questions: Record<string, JevQuestion>;
}

const NoulAnswerSchema = z.object({ type: z.literal("noul"), noul: z.number().min(0).max(1) });
const ChoiceAnswerSchema = z.object({
  type: z.literal("choice"),
  choice: z.string(),
  confidence: z.number().nullable().optional(),
  probabilities: z.record(z.string(), z.number()),
});
const AnswerSchema = z.discriminatedUnion("type", [NoulAnswerSchema, ChoiceAnswerSchema]);

export const JevResponseSchema = z.object({
  model: z.string(),
  answers: z.record(z.string(), AnswerSchema),
  usage: z.object({ input_tokens: z.number(), output_tokens: z.number() }),
});
export type JevResponse = z.infer<typeof JevResponseSchema>;

export class JevApiError extends Error {
  override name = "JevApiError";
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`Jev API ${status}: ${body.slice(0, 300)}`);
    this.status = status;
    this.body = body;
  }
}

export class JevConfigError extends Error {
  override name = "JevConfigError";
}

export interface JevTransport {
  systemOne(request: JevRequest): Promise<JevResponse>;
}

export interface JevClientOptions {
  apiKey: string;
  model: string;
  baseUrl?: string;
  maxRetries?: number;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
}

const RETRYABLE = new Set([429, 500, 502, 503, 504, 529]);

export class JevClient implements JevTransport {
  private readonly options: Required<JevClientOptions>;

  constructor(options: JevClientOptions) {
    if (!options.apiKey) throw new JevConfigError("TYPESAFE_API_KEY is not set");
    this.options = {
      baseUrl: JEV_BASE_URL,
      maxRetries: 4,
      timeoutMs: 30_000,
      fetchImpl: fetch,
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      ...options,
    };
  }

  async systemOne(request: JevRequest): Promise<JevResponse> {
    const body = JSON.stringify({ model: this.options.model, ...request });
    for (let attempt = 0; ; attempt += 1) {
      const response = await this.post(body);
      if (response.ok) return JevResponseSchema.parse(await response.json());
      const text = await response.text();
      if (!RETRYABLE.has(response.status) || attempt >= this.options.maxRetries) {
        throw new JevApiError(response.status, text);
      }
      await this.options.sleep(backoffMs(attempt, response.headers.get("retry-after")));
    }
  }

  private post(body: string): Promise<Response> {
    return this.options.fetchImpl(`${this.options.baseUrl}/v1/systemone`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      body,
      signal: AbortSignal.timeout(this.options.timeoutMs),
    });
  }
}

export function backoffMs(attempt: number, retryAfter: string | null): number {
  const seconds = retryAfter === null ? Number.NaN : Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 30_000);
  return Math.min(500 * 2 ** attempt, 8_000);
}

export function nouls(response: JevResponse): Map<string, number> {
  const out = new Map<string, number>();
  for (const [id, answer] of Object.entries(response.answers)) {
    if (answer.type === "noul") out.set(id, answer.noul);
  }
  return out;
}

// Runs async tasks with bounded concurrency, preserving input order.
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array<R>(items.length);
  let next = 0;
  const worker = async (): Promise<void> => {
    for (let i = next++; i < items.length; i = next++) {
      results[i] = await fn(items[i] as T);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
