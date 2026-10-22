import type { Paths } from "../config.ts";

export interface Flags {
  "decision"?: string | undefined;
  "k"?: string | undefined;
  "tension"?: string[] | undefined;
  "exclude"?: string | undefined;
  "budget"?: string | undefined;
  "out"?: string | undefined;
  "scorer"?: string | undefined;
  "scorers"?: string | undefined;
  "advisors"?: string | undefined;
  "min-words"?: string | undefined;
  "targets"?: string | undefined;
  "check"?: boolean | undefined;
  "json"?: boolean | undefined;
  "allow-sensitive"?: boolean | undefined;
  "help"?: boolean | undefined;
}

export interface CommandContext {
  args: string[];
  flags: Flags;
  paths: Paths;
  env: NodeJS.ProcessEnv;
  out: (text: string) => void;
  warn: (text: string) => void;
}

export class UsageError extends Error {
  override name = "UsageError";
}

export function requireFlag(value: string | undefined, name: string): string {
  if (!value) throw new UsageError(`missing --${name}`);
  return value;
}

export function intFlag(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) throw new UsageError(`expected a positive integer, got "${value}"`);
  return parsed;
}

export function listFlag(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}
