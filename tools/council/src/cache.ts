import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { JevResponseSchema, type JevRequest, type JevResponse, type JevTransport } from "./jev.ts";
import { shortHash } from "./text.ts";

// Content-addressed cache in front of any Jev transport. Identical requests
// (same model, state, questions) are answered from disk: repeat consults cost
// nothing, and evals replay deterministically.
export class CachedJev implements JevTransport {
  hits = 0;
  misses = 0;

  private readonly inner: JevTransport;
  private readonly dir: string;
  private readonly model: string;

  constructor(inner: JevTransport, dir: string, model: string) {
    this.inner = inner;
    this.dir = dir;
    this.model = model;
    mkdirSync(dir, { recursive: true });
  }

  async systemOne(request: JevRequest): Promise<JevResponse> {
    const path = join(this.dir, `${this.key(request)}.json`);
    const cached = readCached(path);
    if (cached) {
      this.hits += 1;
      return cached;
    }
    this.misses += 1;
    const response = await this.inner.systemOne(request);
    // Write-then-rename so a crash never leaves a truncated entry behind.
    const tmp = `${path}.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify(response));
    renameSync(tmp, path);
    return response;
  }

  private key(request: JevRequest): string {
    return shortHash(JSON.stringify({ model: this.model, ...request }), 32);
  }
}

// An unreadable or invalid entry is a miss, never an error: the cache is an
// optimization and must not be able to break a consult.
function readCached(path: string): JevResponse | undefined {
  if (!existsSync(path)) return undefined;
  const text = readFileSync(path, "utf8");
  if (!text.trim().startsWith("{")) return undefined;
  const parsed = JevResponseSchema.safeParse(parseOrUndefined(text));
  return parsed.success ? parsed.data : undefined;
}

function parseOrUndefined(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) return undefined;
    throw error;
  }
}
