# MVP Roadmap

## Phase 1: L.A. Studio Core

Status: current app

- Learner chooses a starting point.
- Learner completes a short diagnostic placement check.
- Learner reads concept theory before problem sets unlock.
- Learner passes lesson checks.
- App creates active problem sets.
- Learner works problems in real time.
- Live coach detects partial progress and common mistakes.
- AI-style guide reveals solution steps progressively when the learner is stuck.
- Submissions update mastery, confidence, support used, attempts, activity, and repair queue.
- The concept map now covers the major university-level linear algebra arc.
- GitHub Pages publishes a standing public demo from `main`.

## Phase 2: Math-Aware Checking

Status: started

- Parse numeric answers with integer, decimal, and fraction equivalence.
- Parse vector answers with labeled coordinates and fraction/decimal equivalence.
- Parse matrix answers entry by entry for bracketed and row-major forms.
- Keep text accepted answers as fallback while structured problem rubrics expand.
- Accept equivalent algebraic forms.
- Capture step-by-step work and save it with attempts.
- Give live step-level feedback against verified solution paths.
- Score work steps with concept-specific evidence rubrics instead of plain token overlap.
- Cover every verified problem with explicit step rubrics.
- Distinguish partial rubric progress from wrong-direction steps.
- Validate every problem with complete, almost-complete, missing-evidence, and wrong-direction sample work.
- Tag misconception patterns from work steps and route targeted repair sets.
- Use a broader misconception taxonomy across core linear algebra concepts.
- Serve repair-only problem variants before ordinary practice in focused repair sets.
- Score using concept-specific rubrics.

## Phase 2A: Stronger Adaptivity

- Expand diagnostic coverage with more than one item per concept.
- Weight diagnostic evidence by confidence and response time.
- Generate prerequisite repair sets automatically.
- Add spaced review scheduling.

## Phase 3: Bigger Verified Curriculum

- Add multiple problems per concept.
- Add variants by difficulty.
- Refine step-rubric weights with real learner data and instructor review.
- Add more repair variants for every misconception.
- Add mixed review sets.
- Add application problems.
- Add transfer and proof problems for advanced topics.

## Phase 4: Durable Accounts

- Add authentication.
- Store learner records in a backend database.
- Sync active sets across devices.
- Export progress reports.

## Phase 4A: Installable App Shell

- Add a web app manifest and install icons.
- Add offline-safe static assets after the data model settles.
- Add service-worker caching once update behavior is predictable.
- Evaluate native wrappers after the PWA version is stable.

## Phase 5: AI-Assisted Coaching

- Use AI only on top of verified problems and solutions.
- Explain mistakes in multiple styles.
- Summarize learner progress.
- Suggest new problem variants for human review.
- Move guided solution generation behind a backend API instead of a browser-only template function.
