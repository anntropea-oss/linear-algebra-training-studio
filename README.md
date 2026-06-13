# L.A. Studio

L.A. Studio is a freestanding React app for learning linear algebra from any starting point. The app creates active problem sets, gives real-time feedback while the learner works, tracks mistakes and progress, and adapts the next set toward repair, review, or challenge.

## Run Locally

```bash
npm install
npm run dev
```

For GitHub Pages-compatible production builds:

```bash
npm run build:pages
```

## Public Demo

The public GitHub Pages demo will deploy from `main` after each merge:

[https://anntropea-oss.github.io/linear-algebra-training-studio/](https://anntropea-oss.github.io/linear-algebra-training-studio/)

Deployment details are in [GitHub Pages Deployment](docs/GITHUB_PAGES_DEPLOYMENT.md).

## Current Experience

- Choose a starting point: brand new, systems, matrices, or advanced review.
- Complete a short diagnostic placement check to refine the starting point.
- Read concept lessons with definitions, theory, and worked examples before practice.
- Pass lesson checks before opening the active problem set.
- Work active problem sets in the browser.
- Get live coaching as you type.
- Enter step-by-step work and get step-level feedback.
- Grade multi-step work with concept-specific weighted step rubrics.
- Distinguish almost-complete work from wrong-direction work.
- Validate rubric behavior with sample student responses for every problem.
- Tag misconception patterns and create targeted repair sets.
- Practice repair-only variants matched to the active misconception.
- Ask for AI-style guided steps when you do not know how to start.
- Submit attempts and update mastery/confidence.
- See concept progress, recent attempts, and a repair queue.
- Persist the learner profile in local browser storage.

## Planning Docs

- [Product Blueprint](docs/PRODUCT_BLUEPRINT.md)
- [Pedagogy Notes](docs/PEDAGOGY_NOTES.md)
- [Curriculum Skill Map](docs/CURRICULUM_SKILL_MAP.md)
- [Rebuild Analysis](docs/REBUILD_ANALYSIS.md)
- [Tracking Plan](docs/TRACKING_PLAN.md)
- [GitHub Pages Deployment](docs/GITHUB_PAGES_DEPLOYMENT.md)
- [Solution Log](SOLUTIONS.md)

## Next Engineering Step

Continue Phase 2 math-aware checking and richer problem authoring:

- diagnostic-driven prerequisite repair
- expanded starter problems for every university-level concept
- more vector, matrix, and equation equivalence checks
- real learner data to refine rubric weights and partial thresholds
- larger verified problem bank
- more repair variants for advanced misconceptions
- adaptive difficulty within each active set
- optional AI explanations grounded in verified solutions
