import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { coverageProblems, loadSpecs, SpecError, type Spec } from "./specs.ts";

const MARKER = "/*__SPECS__*/ {}";

const HEADER = `// GENERATED FILE: do not edit by hand.
// Source: pipeline/engine.js + pipeline/specs/*.json. Regenerate with \`npm run render\` in pipeline/.
`;

export class RenderError extends Error {
  override name = "RenderError";
}

export function renderWorkflow(template: string, specs: Spec[]): string {
  const at = template.indexOf(MARKER);
  if (at === -1 || template.indexOf(MARKER, at + 1) !== -1) {
    throw new RenderError(`engine.js must contain the marker ${MARKER} exactly once`);
  }
  const bySlug = Object.fromEntries(specs.map((spec) => [spec.slug, spec]));
  return HEADER + template.replace(MARKER, JSON.stringify(bySlug, null, 2));
}

// The Workflow runtime runs the script as an async function body with `args`,
// `agent`, `parallel`, `phase`, and `log` in scope. Wrapping it the same way lets
// `node --check` catch syntax errors before a paid run does.
export function asFunctionBody(script: string): string {
  return script.replace(/^export const meta/m, "const meta");
}

export function syntaxError(script: string): string | undefined {
  const file = join(mkdtempSync(join(tmpdir(), "workflow-")), "check.mjs");
  writeFileSync(file, `export async function run(args, agent, parallel, phase, log) {\n${asFunctionBody(script)}\n}\n`);
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  return result.status === 0 ? undefined : result.stderr.trim();
}

interface Layout {
  enginePath: string;
  specsDir: string;
  advisorsDir: string;
  outputPath: string;
}

export function defaultLayout(): Layout {
  const pipelineDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const repo = resolve(pipelineDir, "..");
  return {
    enginePath: join(pipelineDir, "engine.js"),
    specsDir: join(pipelineDir, "specs"),
    advisorsDir: join(repo, "advisors"),
    outputPath: join(repo, ".claude", "workflows", "build-advisor.js"),
  };
}

export function build(layout: Layout): { output: string; warnings: string[] } {
  const specs = loadSpecs(layout.specsDir);
  const dossiers = readdirSync(layout.advisorsDir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  const problems = coverageProblems(specs, dossiers);
  const errors = problems.filter((p) => !p.includes("fine before"));
  if (errors.length > 0) throw new RenderError(errors.join("\n"));
  const output = renderWorkflow(readFileSync(layout.enginePath, "utf8"), specs);
  const invalid = syntaxError(output);
  if (invalid) throw new RenderError(`rendered workflow has a syntax error:\n${invalid}`);
  return { output, warnings: problems.filter((p) => p.includes("fine before")) };
}

function main(argv: string[]): number {
  const layout = defaultLayout();
  const { output, warnings } = build(layout);
  for (const warning of warnings) process.stderr.write(`warning: ${warning}\n`);
  if (argv.includes("--check")) {
    const fresh = existsSync(layout.outputPath) && readFileSync(layout.outputPath, "utf8") === output;
    process.stdout.write(fresh ? "build-advisor.js is up to date\n" : "build-advisor.js is STALE: run `npm run render` in pipeline/\n");
    return fresh ? 0 : 1;
  }
  writeFileSync(layout.outputPath, output);
  process.stdout.write(`wrote ${layout.outputPath}\n`);
  return 0;
}

function entry(): number {
  try {
    return main(process.argv.slice(2));
  } catch (error) {
    if (!(error instanceof SpecError) && !(error instanceof RenderError)) throw error;
    process.stderr.write(`render: ${error.message}\n`);
    return 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = entry();
}
