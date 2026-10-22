import { describe, expect, it } from "vitest";
import { buildGraph } from "../src/graph.ts";
import { card } from "./helpers.ts";

const advisors = [
  { slug: "paul-graham", name: "Paul Graham" },
  { slug: "naval-ravikant", name: "Naval Ravikant" },
  { slug: "luiza-helena-trajano", name: "Luiza Helena Trajano" },
  { slug: "frederico-trajano", name: "Frederico Trajano" },
  { slug: "me", name: "Me Myself" },
];

describe("buildGraph", () => {
  it("links full names and aliases, ignores self", () => {
    const edges = buildGraph([card("me", "disagreement", "vs. Naval on scale; unlike Paul Graham; Me Myself agrees")], advisors);
    expect(edges.map((e) => e.to).sort()).toEqual(["naval-ravikant", "paul-graham"]);
  });

  it("does not match shared surnames alone, but matches accent-folded aliases", () => {
    const edges = buildGraph([card("me", "disagreement", "Trajano family view; but Luíza Trajano says otherwise")], advisors);
    expect(edges.map((e) => e.to)).toEqual(["luiza-helena-trajano"]);
  });

  it("emits an external edge when no member is named", () => {
    const edges = buildGraph([card("me", "disagreement", "vs. lean-startup orthodoxy")], advisors);
    expect(edges).toEqual([expect.objectContaining({ to: "external", external: true })]);
  });

  it("ignores non-disagreement cards", () => {
    expect(buildGraph([card("me", "position", "Naval is wrong")], advisors)).toEqual([]);
  });
});
