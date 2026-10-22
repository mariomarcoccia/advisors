# Retrieval evals

Measures how well each scorer ranks dossier cards for a decision, so switching Jev versions (or falling back to BM25) is a measured choice, not a guess.

- `decisions/*.md`: anonymized, public reference decisions (the same shape `/frame` writes to `decision.en.md`). Private decisions belong in `~/.advisors/evals/`, never here.
- `targets.json`: which advisors to evaluate for each decision.
- `labels/<decision>__<advisor>.json`: graded relevance for **every** rankable card of that advisor (2 = would change the advice on this decision, 1 = useful background, 0 = unrelated). Labeling every card, not a pool, keeps the comparison fair to scorers that surface cards BM25 never would. Labels were produced by Sonnet judges with the rubric above; spot-check before trusting a small difference.

```bash
cd tools/council
node src/cli.ts eval pool --targets ../../evals/targets.json --all   # export cards to label (pools/, gitignored)
node src/cli.ts eval run --targets ../../evals/targets.json --scorers bm25,jev,jev-pair
```

Metrics: nDCG@10 (graded ranking quality at the top, what a pack actually uses), recall@20, P@10. Jev answers are cached under `~/.advisors/cache/jev`, so re-runs are free and deterministic.

**Rule:** bump `DEFAULT_JEV_MODEL` in `tools/council/src/config.ts` only after `eval run` shows the new version at least matching the pinned one.
