import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
    if (existsSync(path)) {
      this.hits += 1;
      return JevResponseSchema.parse(JSON.parse(readFileSync(path, "utf8")));
    }
    this.misses += 1;
    const response = await this.inner.systemOne(request);
    writeFileSync(path, JSON.stringify(response));
    return response;
  }

  private key(request: JevRequest): string {
    return shortHash(JSON.stringify({ model: this.model, ...request }), 32);
  }
}
