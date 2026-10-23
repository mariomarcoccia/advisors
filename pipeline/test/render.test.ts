import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { asFunctionBody, build, defaultLayout, RenderError, renderWorkflow, syntaxError } from "../src/render.ts";
import type { Spec } from "../src/specs.ts";

const layout = defaultLayout();
const { output } = build(layout);

type Agent = (prompt: string, opts: { label: string }) => Promise<unknown>;
type Run = (args: unknown, agent: Agent, parallel: unknown, phase: unknown, log: unknown) => Promise<Record<string, unknown>>;
const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor as new (...params: string[]) => Run;
const workflow = new AsyncFunction("args", "agent", "parallel", "phase", "log", asFunctionBody(output));

// Schema-shaped stand-ins for each phase, so a whole run executes in milliseconds.
function fakeAgent(prompts: string[]): Agent {
  return async (prompt, { label }) => {
    prompts.push(prompt);
    if (label === "enumerate:baseline-sources") return { urls: ["http://www.example.com/already-cited/"] };
    if (label.startsWith("enumerate:")) {
      return { sources: [
        { title: "t", url: `https://example.com/${label}`, type: "essay", priority: "high" },
        { title: "old", url: "https://example.com/already-cited", type: "essay", priority: "high" },
      ] };
    }
    if (label.startsWith("extract:")) return { file: "/n/batch-1.md", covered: 1, failed: [] };
    if (label === "synthesize:draft") return { sourceCount: 3, unusedSources: ["https://example.com/u"], report: "r" };
    if (label === "pre-verify:pick-quotes") return { quotes: [{ quote: "A real quote here", url: "https://example.com/q" }] };
    if (label.startsWith("pre-verify:batch")) return { verdicts: [{ quote: "A real quote here", url: "https://example.com/q", verdict: "not_found" }] };
    return { quotesFixed: 1, completenessGapsClosed: 0, sectionsDeepened: 1, finalSourceCount: 3, report: "done" };
  };
}

async function simulate(slug: string, mode = "rebuild"): Promise<{ result: Record<string, unknown>; prompts: string[] }> {
  const prompts: string[] = [];
  const parallel = (fns: (() => Promise<unknown>)[]) => Promise.all(fns.map((fn) => fn()));
  const args = { slug, mode, repoDir: "/repo/advisors", date: "2026-10-22" };
  const result = await workflow(args, fakeAgent(prompts), parallel, () => {}, () => {});
  return { result, prompts };
}

const slugs = Object.keys(JSON.parse(output.slice(output.indexOf("const SPECS = ") + 14, output.indexOf("\n}\n", output.indexOf("const SPECS = ")) + 2)) as Record<string, unknown>);

describe("rendered workflow", () => {
  it("is syntactically valid and committed fresh", () => {
    expect(syntaxError(output)).toBeUndefined();
    expect(readFileSync(layout.outputPath, "utf8")).toBe(output);
  });

  it("embeds one spec per dossier", () => {
    expect(slugs).toHaveLength(49);
  });

  it.each(slugs)("runs end to end for %s with clean, personal-free prompts", async (slug) => {
    const { result, prompts } = await simulate(slug);
    expect(result["slug"]).toBe(slug);
    const all = prompts.join("\n");
    expect(all).not.toMatch(/\{\{|\$\{|undefined(?!\/)|\bMario\b/);
    expect(all).toContain(`/repo/advisors/advisors/${slug}.md`);
  });

  it("applies per-spec notes only where they belong", async () => {
    const seibel = (await simulate("michael-seibel")).prompts.join("\n");
    const dweck = (await simulate("carol-dweck")).prompts.join("\n");
    expect(seibel).toContain("Dalton Caldwell");
    expect(dweck).not.toContain("Dalton Caldwell");
  });

  it("switches language and corpus conventions", async () => {
    const caito = (await simulate("caito-maia")).prompts.join("\n");
    const brin = (await simulate("sergey-brin")).prompts.join("\n");
    expect(caito).toContain("[translation]");
    expect(brin).toContain("genuinely thin public corpus");
    expect(brin).not.toContain("[translation]");
  });

  it("never relays the dossier through a model and never doubles punctuation", async () => {
    const { prompts } = await simulate("manoel-conde-neto");
    const all = prompts.join("\n");
    expect(all).not.toContain("return its FULL raw text verbatim");
    expect(all).toContain("Read the dossier at /repo/advisors/advisors/manoel-conde-neto.md and extract");
    expect(all).not.toMatch(/Manoel Conde\.\./);
  });

  it("applies a spec's exclusion to every phase, and only for that spec", async () => {
    const manoel = await simulate("manoel-conde-neto");
    const phases = manoel.prompts.filter((p) => !p.startsWith("Verify these quotes") && !p.startsWith("Read the dossier at") && !p.startsWith("Read the frontmatter of"));
    expect(phases.every((p) => p.includes("OUT OF SCOPE (hard rule)"))).toBe(true);
    expect(manoel.prompts.join("\n")).not.toMatch(/governance that names him/);
    expect((await simulate("caito-maia")).prompts.join("\n")).not.toContain("OUT OF SCOPE");
  });

  it("in a rebuild, skips sources the dossier already cites", async () => {
    const { prompts } = await simulate("paul-graham");
    const extract = prompts.filter((p) => p.startsWith("You are extracting")).join("\n");
    expect(extract).toContain("https://example.com/enumerate:own-writing");
    expect(extract).not.toContain("already-cited");
  });

  it("protects quotation punctuation and focuses rebuild checks on new quotes", async () => {
    const rebuild = (await simulate("paul-graham")).prompts.join("\n");
    expect(rebuild).toContain("never alter its wording or punctuation");
    expect(rebuild).toContain("favor quotes from sources new in this draft");
    expect((await simulate("tom-brown", "create")).prompts.join("\n")).not.toContain("favor quotes from sources new");
  });

  it("create mode never claims a baseline dossier exists", async () => {
    const { prompts } = await simulate("tom-brown", "create");
    expect(prompts.join("\n")).toContain("from-scratch build");
    expect(prompts.join("\n")).not.toContain("OVERWRITE");
  });

  it("rejects unknown slugs, relative repo paths, and bad modes", async () => {
    const parallel = () => Promise.resolve([]);
    const run = (args: unknown) => workflow(args, fakeAgent([]), parallel, () => {}, () => {});
    await expect(run({ slug: "nobody", repoDir: "/r" })).rejects.toThrow(/No spec/);
    await expect(run({ slug: "paul-graham", repoDir: "r" })).rejects.toThrow(/absolute/);
    await expect(run({ slug: "paul-graham", repoDir: "/r", mode: "edit" })).rejects.toThrow(/mode/);
  });
});

describe("renderWorkflow", () => {
  it("requires the marker exactly once", () => {
    expect(() => renderWorkflow("no marker", [])).toThrow(RenderError);
    expect(() => renderWorkflow("/*__SPECS__*/ {} /*__SPECS__*/ {}", [])).toThrow(RenderError);
  });

  it("reports syntax errors from the template", () => {
    const broken = renderWorkflow("const SPECS = /*__SPECS__*/ {}\nconst x = ;", [] as Spec[]);
    expect(syntaxError(broken)).toMatch(/SyntaxError/);
  });
});
