# Linear Algebra Live Tutor

A freestanding React app for learning linear algebra from any starting point. The app creates active problem sets, gives real-time feedback while the learner works, tracks mistakes and progress, and adapts the next set toward repair, review, or challenge.

## Run Locally

```bash
npm install
npm run dev
```

For GitHub Pages-compatible production builds:

```bash
npm run build:pages
```

## Current Experience

- Choose a starting point: brand new, systems, matrices, or advanced review.
- Complete a short diagnostic placement check to refine the starting point.
- Read concept lessons with definitions, theory, and worked examples before practice.
- Pass lesson checks before opening the active problem set.
- Work active problem sets in the browser.
- Get live coaching as you type.
- Ask for AI-style guided steps when you do not know how to start.
- Submit attempts and update mastery/confidence.
- See concept progress, recent attempts, and a repair queue.
- Persist the learner profile in local browser storage.

## Planning Docs

- [Product Blueprint](/Users/atropea/Documents/Linear%20Algebra/docs/PRODUCT_BLUEPRINT.md)
- [Pedagogy Notes](/Users/atropea/Documents/Linear%20Algebra/docs/PEDAGOGY_NOTES.md)
- [Curriculum Skill Map](/Users/atropea/Documents/Linear%20Algebra/docs/CURRICULUM_SKILL_MAP.md)
- [Rebuild Analysis](/Users/atropea/Documents/Linear%20Algebra/docs/REBUILD_ANALYSIS.md)
- [Tracking Plan](/Users/atropea/Documents/Linear%20Algebra/docs/TRACKING_PLAN.md)
- [Solution Log](/Users/atropea/Documents/Linear%20Algebra/SOLUTIONS.md)

## Next Engineering Step

Continue Phase 2 math-aware checking and richer problem authoring:

- diagnostic-driven prerequisite repair
- expanded starter problems for every university-level concept
- more vector, matrix, and equation equivalence checks
- step-based submissions
- concept-specific rubrics
- larger verified problem bank
- adaptive difficulty within each active set
- optional AI explanations grounded in verified solutions
