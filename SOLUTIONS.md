## [2026-06-05 21:32] Activity Event Type Widening
- Problem: `npm run build` failed in `src/data/learningModel.ts` because `logAssignment` and `logDownload` returned activity log arrays containing event objects whose `type` field widened to plain `string`.
- Root Cause: Inline object literals were merged into `ActivityEvent[]` without an explicit `ActivityEvent` annotation, so TypeScript did not preserve the literal union type for `type`.
- Solution: Created explicitly typed `ActivityEvent` constants inside `logAssignment` and `logDownload` before appending them to the learner activity log.
- Files Changed: `src/data/learningModel.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build` completed successfully after the event objects were explicitly typed.

## [2026-06-05 21:34] Large Initial JavaScript Chunk
- Problem: `npm run build` succeeded but Vite warned that the generated JavaScript chunk exceeded 500 kB after minification.
- Root Cause: Recharts and the dashboard application code were bundled together in the initial route chunk.
- Solution: Moved Recharts usage into `src/components/Charts.tsx` and lazy-loaded the chart components with React `Suspense`, leaving lightweight chart placeholders while the chart chunk loads.
- Files Changed: `src/App.tsx`, `src/App.css`, `src/components/Charts.tsx`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build` now emits a 231.15 kB main JS chunk and a separate 386.55 kB chart chunk with no chunk-size warning.

## [2026-06-05 21:39] Tunnel Host Blocked By Vite
- Problem: The public localtunnel URL returned `403 Forbidden` with the message that `moody-emus-swim.loca.lt` was not allowed by the Vite dev server.
- Root Cause: Vite's dev server host allowlist did not include localtunnel hostnames.
- Solution: Added `server.allowedHosts: ['.loca.lt']` to `vite.config.ts` and restarted the dev server.
- Files Changed: `vite.config.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `curl -I https://moody-emus-swim.loca.lt` now returns `HTTP/1.1 200 OK`.

## [2026-06-05 21:44] Auto-Generated Git Commit Identity
- Problem: The initial commit succeeded but Git warned that the committer identity was auto-generated as `Ann Tropea <atropea@Ann-Tropeas-MacBook-Pro-1517.local>`.
- Root Cause: The local repository did not have an explicit `user.name` and `user.email` configured before the first commit.
- Solution: Set the local repository Git identity to `anntropea-oss <269201269+anntropea-oss@users.noreply.github.com>` and amended the initial commit before pushing.
- Files Changed: `SOLUTIONS.md`, local `.git/config`
- Status: Resolved
- Verification: `git log -1 --format='%an <%ae>'` should show the GitHub no-reply identity after the amended commit.

## [2026-06-05 21:50] Parallel Milestone API Parse Failure
- Problem: Two GitHub milestone creation calls failed with `unexpected end of JSON input` during parallel API execution.
- Root Cause: Unknown; likely a transient `gh api` response parsing issue while several milestone creation calls ran at once.
- Solution: Queried existing milestones, identified the missing `Diagnostic Engine` and `Persistence and Auth` milestones, and recreated them sequentially.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: `gh api repos/anntropea-oss/linear-algebra-training-studio/milestones --jq '.[] | "#\\(.number) \\(.title)"'` lists all intended milestones.

## [2026-06-05 21:52] GitHub Projects Scope Missing
- Problem: Attempting to inspect or create GitHub Projects with `gh project list --owner anntropea-oss` failed because the token was missing the `read:project` scope.
- Root Cause: The authenticated GitHub CLI token has repository scopes but not GitHub Projects scopes.
- Solution: Used repository issues, labels, and milestones as the active tracking system and documented the Projects limitation in `docs/GITHUB_SETUP.md`.
- Files Changed: `SOLUTIONS.md`, `docs/GITHUB_SETUP.md`
- Status: Workaround
- Verification: GitHub issues, labels, and milestones were created successfully; only the optional Projects board remains unavailable without refreshing GitHub CLI auth scopes.

## [2026-06-06 17:01] Unused Rubric Import
- Problem: `npm run build` and `npm run lint` failed because `src/App.tsx` imported `rubrics` without using it.
- Root Cause: The rubric panel uses `getRubric(...)`, but the broader `rubrics` collection was left in the import list during UI wiring.
- Solution: Removed the unused `rubrics` import from `src/App.tsx`.
- Files Changed: `src/App.tsx`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build` and `npm run lint` completed successfully after removing the unused import.

## [2026-06-06 17:04] In-App Browser Backend Unavailable
- Problem: Browser verification could not run because the Browser plugin reported `No Codex browser route is available` and then `Browser is not available: iab`.
- Root Cause: No session-owned in-app browser backend was discoverable for the current thread.
- Solution: Reset the browser-control JavaScript kernel, confirmed `agent.browsers.list()` returned an empty list, and used build/lint plus local server checks as the verification workaround.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: `agent.browsers.list()` returned `[]`; `curl` confirmed the local Vite server is reachable.

## [2026-06-06 17:05] Local Snapshot Shape Migration Risk
- Problem: Older browser localStorage snapshots from the first prototype could miss new fields such as `attemptLog`, mistake `categoryId`, mistake `status`, and assignment problem rubric metadata, causing runtime crashes after refresh.
- Root Cause: The persistence layer originally trusted parsed snapshots without normalizing them against the current learner and assignment schema.
- Solution: Added snapshot normalization in `src/data/persistence.ts` to fill missing learner fields, normalize mistake records, and replace stale assignment shapes with current fallback assignments.
- Files Changed: `src/data/persistence.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build`, `npm run lint`, and `curl http://127.0.0.1:5173/` all completed successfully after the migration patch.

## [2026-06-06 17:38] Parallel Git Pull And Fetch Ref Lock
- Problem: Running `git pull --ff-only` and `git fetch --prune` in parallel caused `git pull` to fail with `cannot lock ref 'refs/remotes/origin/main'` because the remote-tracking ref changed during the pull.
- Root Cause: The parallel fetch updated `origin/main` while the pull command still expected the previous ref value.
- Solution: Re-ran `git pull --ff-only` sequentially after the fetch completed.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: The sequential `git pull --ff-only` fast-forwarded local `main` to the merged PR commit.

## [2026-06-06 17:54] Merged PR Did Not Auto-Close Issues
- Problem: PR #7 merged successfully, but GitHub left issues #1 through #6 open even though the PR body included closing keywords.
- Root Cause: Unknown; GitHub did not apply the expected automatic issue-closing behavior after the merge.
- Solution: Closed issues #1 through #6 manually with comments linking each issue to merged PR #7.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: `gh issue close` succeeded for issues #1, #2, #3, #4, #5, and #6.

## [2026-06-06 18:27] Stale Public Demo Tunnel
- Problem: The previous localtunnel demo URL returned `503`, and no localtunnel process was active.
- Root Cause: The earlier ephemeral tunnel process had stopped.
- Solution: Started a fresh localtunnel session for the running Vite app at `https://six-wings-walk.loca.lt`.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: `curl -I https://six-wings-walk.loca.lt` returned `HTTP/1.1 200 OK`.

## [2026-06-06 21:20] Assignment Map Type Mismatch
- Problem: `npm run build` failed after converting assignments into multi-set records because `loadTrainingSnapshot` still accepted `Record<string, Assignment>` while the app now passes `Record<string, Assignment[]>`.
- Root Cause: The persistence loader signature was not updated during the active problem-set migration.
- Solution: Updated `loadTrainingSnapshot` to accept `Record<string, Assignment[]>` and kept the loader's migration path for older single-assignment snapshots.
- Files Changed: `src/data/persistence.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build` and `npm run lint` completed successfully after the signature fix.

## [2026-06-06 21:38] Scratch Tutor Build Errors
- Problem: The first scratch rebuild failed `npm run build` and `npm run lint` because `src/App.tsx` had an unused `getProblem` import, an unused `updateProfile` helper, a custom CSS property that needed typing, and a React lint violation from setting answer state inside an effect.
- Root Cause: The old dashboard state pattern was replaced quickly, leaving stale imports and effect-based answer synchronization.
- Solution: Removed the unused import/helper, typed the `--value` meter style, and replaced effect-synced answer state with per-problem draft and hint maps.
- Files Changed: `src/App.tsx`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build` and `npm run lint` completed successfully after the scratch tutor fixes.

## [2026-06-06 21:47] Prototype Drift From Learner Tutor Goal
- Problem: The prior prototype and planning docs over-weighted instructor dashboards, reporting, and backend administration before the core learner experience supported real-time problem solving.
- Root Cause: The initial scope mixed long-term training operations with the immediate pedagogical requirement: help a learner work linear algebra problems from their current level and understand mistakes while solving.
- Solution: Rebuilt the app around a learner-facing active problem-set loop, added a tutor engine and local learner storage, removed backend-heavy prototype modules/docs, and documented the restart rationale in `docs/REBUILD_ANALYSIS.md`.
- Files Changed: `README.md`, `docs/REBUILD_ANALYSIS.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/PEDAGOGY_NOTES.md`, `docs/CURRICULUM_SKILL_MAP.md`, `docs/MVP_ROADMAP.md`, `src/App.tsx`, `src/App.css`, `src/domain/tutorEngine.ts`, `src/domain/storage.ts`, `package.json`, `package-lock.json`, `SOLUTIONS.md`
- Status: Resolved
- Verification: The rebuilt app now opens on starting-point selection, active problem sets, live feedback, hints, worked solution steps, repair sets, recent attempts, activity logs, and concept progress instead of an instructor/admin dashboard.

## [2026-06-06 21:48] In-App Browser Verification Still Unavailable
- Problem: Final browser verification for the scratch tutor rebuild could not run because the Browser plugin again reported `Browser is not available: iab`.
- Root Cause: No session-owned in-app browser backend was available to the current thread.
- Solution: Kept the existing workaround path: verified the rebuilt app with production build, lint, git diff checks, and a local Vite server `200 OK` response.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: Browser setup failed with `Browser is not available: iab`; `npm run build`, `npm run lint`, `git diff --check`, and `curl -I http://127.0.0.1:5173/` completed successfully.

## [2026-06-06 21:50] Pull Request Body Shell Quoting Error
- Problem: The first `gh pr create` command emitted `zsh:1: command not found: Browser` and produced a malformed PR note because a backticked browser error inside the double-quoted shell argument was interpreted by the shell.
- Root Cause: Shell command substitution ran before GitHub CLI received the PR body text.
- Solution: Edited PR #8 with a single-quoted body that avoids command substitution and preserves the intended browser-verification note.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: `gh pr edit 8 --body ...` succeeded and returned the PR URL.

## [2026-06-06 21:52] Public Demo Tunnel Expired Again
- Problem: The previous public demo URL `https://six-wings-walk.loca.lt` returned `503 Service Unavailable`, and no localtunnel process was running.
- Root Cause: The prior ephemeral localtunnel process stopped.
- Solution: Started a fresh localtunnel session for the rebuilt Vite app at `https://sweet-tires-fail.loca.lt`.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: `curl -I https://sweet-tires-fail.loca.lt` returned `HTTP/1.1 200 OK`.

## [2026-06-06 21:54] Replacement Demo Tunnel Returned 408
- Problem: The replacement public demo URL `https://sweet-tires-fail.loca.lt` began returning `408 Request Timeout` during final verification.
- Root Cause: Unknown; the local Vite server remained healthy, so the failure was isolated to the localtunnel session.
- Solution: Stopped the unreliable tunnel and started a new localtunnel session at `https://free-breads-hope.loca.lt`.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: `curl -I https://free-breads-hope.loca.lt` returned `HTTP/1.1 200 OK`, and `curl -L --max-time 15 https://free-breads-hope.loca.lt` returned `200` with the app HTML.

## [2026-06-06 21:56] Detached Demo Tunnel Did Not Stay Alive
- Problem: Attempting to restart `https://free-breads-hope.loca.lt` as a detached localtunnel process left no running localtunnel process and the URL returned `502 Bad Gateway`.
- Root Cause: Unknown; the detached `npx localtunnel` process exited without useful log output.
- Solution: Started a live localtunnel session instead at `https://mean-brooms-pump.loca.lt`.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: `curl -I https://mean-brooms-pump.loca.lt` returned `HTTP/1.1 200 OK`, and `curl -L --max-time 15 https://mean-brooms-pump.loca.lt` returned `200` with the app HTML.

## [2026-06-06 22:05] Ungated Solutions And Untracked Support Use
- Problem: The app showed full worked solution steps before the learner asked for help, and submitted attempts did not record how many hints or guided steps were used.
- Root Cause: The scratch MVP exposed `solutionSteps` as a static panel and `submitResponse` only accepted the final response text.
- Solution: Added `createGuidedSolution(...)` to produce progressive AI-style guidance from verified problem templates, replaced the always-visible worked path with a guided reveal panel, added an `I don't know yet` action, and passed hint/guide counts into submitted progress and attempt records.
- Files Changed: `src/domain/tutorEngine.ts`, `src/App.tsx`, `src/App.css`, `README.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/PEDAGOGY_NOTES.md`, `docs/MVP_ROADMAP.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build`, `npm run lint`, and `git diff --check` completed successfully after the guided-solution changes.

## [2026-06-06 22:07] Guided Solution Browser Verification Workaround
- Problem: In-app browser verification for the guided solution UI failed again with `Browser is not available: iab`, and the prior public tunnel `https://mean-brooms-pump.loca.lt` returned `408`.
- Root Cause: No session-owned in-app browser backend was available; the localtunnel session became stale while the local Vite server stayed healthy.
- Solution: Verified the feature with production build, lint, diff checks, and local Vite server responses, then stopped the stale localtunnel process.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: `npm run build`, `npm run lint`, `git diff --check`, `curl -I http://127.0.0.1:5173/`, and `curl -L --max-time 15 http://127.0.0.1:5173/` completed successfully.

## [2026-06-07 21:42] In-App Demo Browser Unavailable
- Problem: The user asked to show the new demo, but the in-app Browser backend again reported `Browser is not available: iab`.
- Root Cause: No session-owned in-app browser backend was available to this thread.
- Solution: Started the local Vite dev server, opened `http://127.0.0.1:5173/` in the system browser, and verified the local app responds.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: `curl -I http://127.0.0.1:5173/` returned `HTTP/1.1 200 OK`.

## [2026-06-07 21:43] Detached Demo Server Exited
- Problem: Moving the Vite demo server into a detached `nohup` process caused the process to exit after printing the local URL, so `curl` could not connect to `127.0.0.1:5173`.
- Root Cause: Unknown; the detached child process did not stay alive in this execution environment.
- Solution: Restarted the Vite demo server in an interactive session and reopened `http://127.0.0.1:5173/` in the system browser.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: The interactive server reported `VITE v8.0.16 ready`, and `curl -I http://127.0.0.1:5173/` returned `HTTP/1.1 200 OK`.

## [2026-06-07 21:55] Problem Sets Appeared Before Theory
- Problem: The app still behaved too much like a practice generator because active problem sets appeared before concept-level theoretical grounding, definitions, and worked examples.
- Root Cause: The live tutor MVP optimized for real-time problem solving first and did not include lesson content or a lesson-completion gate before practice.
- Solution: Added a concept lesson library, lesson completion tracking, localStorage normalization for older profiles, a theory-first lesson card, readiness checks, and a practice unlock action before the answer workspace appears.
- Files Changed: `src/domain/tutorEngine.ts`, `src/domain/storage.ts`, `src/App.tsx`, `src/App.css`, `README.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/PEDAGOGY_NOTES.md`, `docs/CURRICULUM_SKILL_MAP.md`, `docs/MVP_ROADMAP.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build`, `npm run lint`, and `git diff --check` completed successfully after adding lesson-first curriculum support.

## [2026-06-07 21:56] Lesson-First Browser Verification Workaround
- Problem: In-app browser verification for the lesson-first curriculum failed again with `Browser is not available: iab`.
- Root Cause: No session-owned in-app browser backend was available to this thread.
- Solution: Verified the app with production build, lint, diff checks, and the local Vite server instead.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: `npm run build`, `npm run lint`, `git diff --check`, and `curl -I http://127.0.0.1:5173/` completed successfully.

## [2026-06-07 22:04] Pedagogical Adaptivity Gaps
- Problem: The app now teaches concepts before practice, but it still lacks several elements needed for efficient university-level learning: diagnostic placement, prerequisite repair, spaced retrieval, transfer problems, mastery calibration, and richer individual adaptation.
- Root Cause: The current MVP focused on lesson-first flow, live problem solving, and guided support before adding a full learning science model.
- Solution: No implementation applied yet; identified the missing instructional systems and recommended a development sequence for future work.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: Open product gap identified during curriculum review; no code verification applies yet.

## [2026-06-07 22:14] Diagnostic And Lesson Check Foundation
- Problem: The app had no diagnostic placement, prerequisite readiness map, or active checks for understanding before practice, so personalization still depended too much on the learner's self-selected starting point.
- Root Cause: Earlier milestones added lesson-first flow and guided support before building the adaptive routing layer.
- Solution: Added diagnostic questions, diagnostic scoring, prerequisite graph/status, lesson check questions, lesson-check gating before practice unlocks, diagnostic placement application, profile persistence normalization, and documentation for the adaptive foundation.
- Files Changed: `src/domain/tutorEngine.ts`, `src/domain/storage.ts`, `src/App.tsx`, `src/App.css`, `README.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/PEDAGOGY_NOTES.md`, `docs/CURRICULUM_SKILL_MAP.md`, `docs/MVP_ROADMAP.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build`, `npm run lint`, and `git diff --check` completed successfully after adding diagnostic and lesson-check support.

## [2026-06-07 22:14] Diagnostic Placement Reset Lesson History
- Problem: The first diagnostic placement implementation cleared `lessonReads` and `lessonCheckRecords`, which would make learners repeat lessons they had already completed after retaking the diagnostic.
- Root Cause: `applyDiagnosticPlacement(...)` rebuilt the active path from diagnostic evidence and reset lesson state as part of that rebuild.
- Solution: Preserved existing `lessonReads` and `lessonCheckRecords` while still rebuilding the active problem set around the diagnostic recommendation.
- Files Changed: `src/domain/tutorEngine.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build`, `npm run lint`, and `git diff --check` completed successfully after preserving lesson history during placement.

## [2026-06-07 22:22] Adaptive Foundation Browser Verification Workaround
- Problem: In-app browser verification for the diagnostic/adaptive foundation failed again with `Browser is not available: iab`.
- Root Cause: No session-owned in-app browser backend was available to this thread.
- Solution: Verified the app with production build, lint, diff checks, and the local Vite server instead.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: `npm run build`, `npm run lint`, `git diff --check`, and `curl -I http://127.0.0.1:5173/` completed successfully.

## [2026-06-07 22:24] Caffeinate Process Exited
- Problem: The background `caffeinate` process started to keep the machine awake was no longer running during the final milestone check.
- Root Cause: Unknown; PID `21466` was no longer present.
- Solution: Restarted `caffeinate -dimsu` in the background with PID `24803`.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: `ps -p $(cat /tmp/linear-algebra-caffeinate.pid) -o pid=,command=` showed `24803 caffeinate -dimsu`.

## [2026-06-07 22:25] Detached Caffeinate Still Exited
- Problem: Detached `caffeinate` attempts, including `caffeinate -dimsu sleep 86400`, exited quickly in this execution environment.
- Root Cause: Unknown; detached background processes appear unreliable for keeping `caffeinate` alive here.
- Solution: Started `caffeinate -dimsu` as a live tool session instead.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: The `caffeinate -dimsu` command is running in active session `72848`.

## [2026-06-07 22:31] Curriculum Map Missing University Topics
- Problem: The concept map still stopped at a compact eight-topic path and omitted core university-level topics such as determinants, inverses, fundamental subspaces, rank-nullity, change of basis, diagonalization, least squares, and proof techniques.
- Root Cause: Earlier milestones focused on tutor flow, diagnostics, and lesson gating before broadening the full course scope.
- Solution: Added the missing topics as first-class concepts with prerequisites, lessons, diagnostic questions, lesson checks, and starter problems.
- Files Changed: `src/domain/tutorEngine.ts`, `README.md`, `docs/CURRICULUM_SKILL_MAP.md`, `docs/MVP_ROADMAP.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/PEDAGOGY_NOTES.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build`, `npm run lint`, and `git diff --check` completed successfully after expanding the curriculum map.

## [2026-06-07 22:31] Saved Profiles Missing New Concept Keys
- Problem: Existing localStorage learner profiles created before the curriculum expansion would not have mastery or confidence values for the new concepts.
- Root Cause: The persistence normalization filled missing support fields but did not backfill newly added concept keys.
- Solution: Updated profile normalization to merge saved mastery/confidence with a fresh generated profile, preserving existing values while adding defaults for new concepts.
- Files Changed: `src/domain/storage.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build`, `npm run lint`, and `git diff --check` completed successfully after the migration update.

## [2026-06-07 22:31] Least Squares Accepted Answer Token Mismatch
- Problem: A new least-squares starter problem accepted `A^T r = 0`, but its `mustInclude` rule required the word `orthogonal`, so that accepted answer form would still be scored incomplete.
- Root Cause: The accepted answer list and required token rule were not aligned for an equivalent mathematical statement.
- Solution: Removed the `mustInclude` requirement from that problem so either orthogonality language or the normal-equation condition can be accepted.
- Files Changed: `src/domain/tutorEngine.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build`, `npm run lint`, and `git diff --check` completed successfully after aligning the answer rule.

## [2026-06-07 22:31] Expanded Diagnostic Advanced Fallback Was Stale
- Problem: If a learner answered every expanded diagnostic item correctly, the fallback recommended start still pointed to `eigenvalues`, even though the curriculum now extends beyond eigenvalues.
- Root Cause: The diagnostic fallback was written for the older eight-topic path where eigenvalues was the final advanced topic.
- Solution: Updated the all-correct diagnostic fallback to recommend `diagonalization`, a later advanced topic in the expanded sequence.
- Files Changed: `src/domain/tutorEngine.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run build`, `npm run lint`, and `git diff --check` completed successfully after updating the fallback.

## [2026-06-07 22:36] No Automated PR Checks Reported
- Problem: GitHub reported no automated checks for PR #12, so branch validation depends on local verification.
- Root Cause: Unknown; no required CI checks are currently reported for this repository.
- Solution: Logged the gap and used local `npm run build`, `npm run lint`, and `git diff --check` as the verification path for this milestone.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: `gh pr checks 12` returned `no checks reported on the 'codex/university-curriculum-map' branch`.

## [2026-06-07 22:39] Shareable Demo Was Not Configured
- Problem: The project did not have a public demo URL; the GitHub Pages API returned 404 for the repository's Pages configuration.
- Root Cause: GitHub Pages had not been enabled for the repository, and the Vite build did not have a Pages-specific base path command.
- Solution: Added a `build:pages` script and published the current production build to the `gh-pages` branch, then moved to a temporary tunnel after GitHub Pages could not be enabled for the private repository.
- Files Changed: `package.json`, `README.md`, `SOLUTIONS.md`, `gh-pages` branch deployment files
- Status: Workaround
- Verification: `npm run build:pages`, `npm run lint`, `git diff --check`, and HTTP verification of the temporary tunnel URL.

## [2026-06-07 22:40] GitHub Pages Blocked For Private Repository
- Problem: Enabling GitHub Pages failed with `Your current plan does not support GitHub Pages for this repository.`
- Root Cause: The repository is private and the current GitHub plan does not support Pages for it.
- Solution: Removed the premature permanent demo link from the README, kept the Pages-compatible build command for future hosting, and started a verified localtunnel demo backed by the live Vite server.
- Files Changed: `README.md`, `SOLUTIONS.md`
- Status: Workaround
- Verification: `gh api --method POST repos/anntropea-oss/linear-algebra-training-studio/pages` returned HTTP 422, while `curl -I https://rich-rabbits-give.loca.lt` returned HTTP 200.

## [2026-06-08 20:49] Phase 2 Lacked Math-Aware Scoring
- Problem: Problem responses were still graded mainly with normalized string matching, so equivalent forms such as fractions versus decimals, labeled coordinates, and matrix entries were fragile.
- Root Cause: The MVP evaluator had no structured expected-answer model or math parser.
- Solution: Added a reusable math answer evaluator for numbers, vectors, and matrices; attached structured expected answers to the first batch of unambiguous problems; and integrated the evaluator into live feedback while preserving text accepted-answer fallbacks.
- Files Changed: `src/domain/mathAnswer.ts`, `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `tsconfig.test.json`, `package.json`, `.gitignore`, `README.md`, `docs/MVP_ROADMAP.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run test:math`, `npm run build`, `npm run lint`, and `git diff --check` completed successfully.

## [2026-06-08 20:49] Optional Must-Include Tokens Overstated Partial Credit
- Problem: Problems without `mustInclude` tokens treated any non-empty short response as if it matched required evidence, which could overstate partial progress for wrong answers.
- Root Cause: `mustIncludeMatch` defaulted to true when no `mustInclude` array existed and was reused as a partial-credit signal.
- Solution: Split the logic so missing `mustInclude` still allows accepted answers, but only actual required-token matches count as partial evidence.
- Files Changed: `src/domain/tutorEngine.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run test:math`, `npm run build`, `npm run lint`, and `git diff --check` completed successfully.

## [2026-06-08 20:49] Direct TypeScript Test Execution Was Unsupported
- Problem: `node --experimental-strip-types --input-type=module` failed on a TypeScript type declaration while checking whether parser tests could run directly.
- Root Cause: The local Node runtime did not strip TypeScript syntax in that execution mode.
- Solution: Added a dedicated `tsconfig.test.json` path that compiles parser tests to `.tmp-tests`, then runs them with Node's built-in test runner.
- Files Changed: `package.json`, `tsconfig.test.json`, `test/mathAnswer.test.ts`, `.gitignore`, `SOLUTIONS.md`
- Status: Workaround
- Verification: `npm test` compiled and ran eight parser/integration tests successfully.

## [2026-06-08 20:49] Initial Phase 2 Build And Lint Failures
- Problem: The first Phase 2 verification pass failed because TypeScript did not narrow an optional `mustInclude` array, and ESLint rejected unnecessary escapes in parser regex literals.
- Root Cause: The evaluator integration referenced an optional field after a boolean guard, and the first regex literal form was stricter than ESLint allows.
- Solution: Used optional chaining for the token check and moved the grouping regex to a `RegExp` constructor string.
- Files Changed: `src/domain/tutorEngine.ts`, `src/domain/mathAnswer.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm run test:math`, `npm run build`, `npm run lint`, and `git diff --check` completed successfully after the fixes.

## [2026-06-08 20:50] Node Test Compile Needed ESM File Extensions
- Problem: Importing the tutor engine in the parser integration test failed because NodeNext module resolution requires explicit file extensions for relative ESM imports.
- Root Cause: The app's bundler-friendly import from `tutorEngine.ts` to `mathAnswer.ts` used an extensionless relative path, which Vite accepts but the Node test compile does not.
- Solution: Updated the new parser import in `tutorEngine.ts` to use the emitted `.js` extension while keeping the Vite build compatible.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test`, `npm run build`, `npm run lint`, and `git diff --check` completed successfully after the import update.

## [2026-06-08 20:52] No Automated PR Checks Reported For Phase 2 PR
- Problem: GitHub reported no automated checks for PR #13, so branch validation again depends on local verification.
- Root Cause: Unknown; the repository still has no reported CI checks for pull requests.
- Solution: Logged the PR-specific occurrence and used local `npm test`, `npm run build`, `npm run lint`, and `git diff --check` as the verification path.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: `gh pr checks 13` returned `no checks reported on the 'codex/phase-2-math-checking' branch`.

## [2026-06-08 20:53] Caffeinate Session Was No Longer Running
- Problem: The keep-awake `caffeinate -dimsu` process was no longer present during the final Phase 2 sanity check.
- Root Cause: Unknown; previous live or detached keep-awake sessions do not reliably persist across long thread activity.
- Solution: Restarted `caffeinate -dimsu` as live session `35436`.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: The `caffeinate -dimsu` command is running in active session `35436`.

## [2026-06-08 21:01] Step-by-Step Work Was Not Captured
- Problem: Learners could only submit one final response, so the app could not record intermediate reasoning or identify where a solution path drifted.
- Root Cause: The problem progress and attempt model had no `workSteps` field, and the UI only exposed a single answer textarea.
- Solution: Added step-work data to progress and attempts, added live step evaluation against verified solution steps, added a work-path editor and step coach to the problem workspace, and included step-progress summaries in attempt feedback.
- Files Changed: `src/domain/tutorEngine.ts`, `src/domain/storage.ts`, `src/App.tsx`, `src/App.css`, `test/mathAnswer.test.ts`, `README.md`, `docs/MVP_ROADMAP.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test`, `npm run build`, `npm run lint`, `git diff --check`, `curl -I http://127.0.0.1:5173/`, and browser interaction verified step rows, step-level feedback, and submitted attempt summaries.

## [2026-06-08 21:01] Saved Profiles Missing Work Step Fields
- Problem: Existing localStorage profiles created before step capture would not have `workSteps` on prior progress or attempts.
- Root Cause: The persistence schema gained a new field after earlier profiles were already saved.
- Solution: Updated profile normalization to backfill empty `workSteps` arrays for saved problem progress and attempt records.
- Files Changed: `src/domain/storage.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test`, `npm run build`, `npm run lint`, and `git diff --check` completed successfully after the normalization update.

## [2026-06-08 21:01] Initial Browser Verification Tab Crashed
- Problem: The first in-app browser navigation to the local Vite app timed out and left the tab on a crash page.
- Root Cause: Unknown; the local server itself responded with HTTP 200, so the failure was isolated to the first browser tab.
- Solution: Retried in a clean browser tab and completed the UI verification there.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: `curl -I http://127.0.0.1:5173/` returned HTTP 200, and the clean browser tab loaded `Linear Algebra Training Studio` and verified the step-work flow.

## [2026-06-08 21:01] Step-Only Submissions Could Advance Problems
- Problem: The first step-capture UI allowed the Submit button when a learner had entered step work but no final answer, which could mark a problem answered without a final response.
- Root Cause: The submit disabled condition counted step evidence as sufficient for submission.
- Solution: Restored the final-answer requirement while keeping step feedback live before submission.
- Files Changed: `src/App.tsx`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test`, `npm run build`, `npm run lint`, `git diff --check`, and browser interaction confirmed Submit stays disabled when only step work is entered.

## [2026-06-08 21:04] No Automated PR Checks Reported For Step Capture PR
- Problem: GitHub reported no automated checks for PR #14, so branch validation again depends on local verification.
- Root Cause: Unknown; the repository still has no reported CI checks for pull requests.
- Solution: Logged the PR-specific occurrence and used local test, build, lint, diff, HTTP, and browser verification as the validation path.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: `gh pr checks 14` returned `no checks reported on the 'codex/phase-2-step-work-capture' branch`.

## [2026-06-08 21:14] Step Misconceptions Did Not Route Repairs
- Problem: Captured work steps could be marked as needing repair, but the app did not tag the specific misconception or use that tag to generate a focused repair set.
- Root Cause: Step feedback only stored generic `needs-work` status, and repair sets only used broad prerequisite/concept selection.
- Solution: Added misconception metadata to step feedback, attempts, and repair records; classified common step drifts; prioritized repair-set problems that match the next open misconception; and added a targeted repair action in the repair queue.
- Files Changed: `src/domain/tutorEngine.ts`, `src/App.tsx`, `src/App.css`, `test/mathAnswer.test.ts`, `README.md`, `docs/MVP_ROADMAP.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test`, `npm run build`, `npm run lint`, `git diff --check`, and browser interaction verified a sign-slip step tag, repair evidence, and a targeted repair set.

## [2026-06-08 21:14] Correct Final Answers Could Hide Bad Work
- Problem: A learner could submit a correct final answer while the recorded work path still contained a misconception, leaving no repair target for the faulty reasoning.
- Root Cause: `submitResponse` only created mistake records from final-answer mistake feedback.
- Solution: Submission now creates repair records from the first detected step misconception when final-answer feedback has no mistake.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms a correct final answer with a sign-slip work step still logs a work-step repair record.

## [2026-06-08 21:16] Browser LocalStorage Reset Was Unavailable
- Problem: Browser verification could not clear the learner profile with a direct `localStorage.clear()` automation call in the in-app browser context.
- Root Cause: Unknown; the page evaluation environment did not expose `localStorage` for that automation attempt.
- Solution: Used the app's reset control to clear the profile state before continuing browser verification.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: Browser verification continued from a reset Systems path and confirmed step misconception evidence plus targeted repair-set creation.

## [2026-06-08 21:17] Legacy Repairs Could Delay Targeted Repair
- Problem: Existing unresolved repair records without `misconceptionId` could be selected before newer targeted repair records, delaying the focused repair set a learner should see next.
- Root Cause: The repair selector chose the first unresolved mistake without preferring records that contain the new misconception metadata.
- Solution: Updated repair selection to prefer unresolved mistakes with a `misconceptionId`, while still falling back to any unresolved mistake for older records.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: Added a regression test proving targeted repairs are selected before legacy untargeted repairs.

## [2026-06-08 21:18] No Automated PR Checks Reported For Misconception Routing PR
- Problem: GitHub reported no automated checks for PR #15, so validation for the misconception-routing branch depends on local verification.
- Root Cause: Unknown; the repository still has no reported CI checks for pull requests.
- Solution: Logged the PR-specific occurrence and used local test, build, lint, diff, and browser verification as the validation path.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: `gh pr checks 15` returned `no checks reported on the 'codex/phase-2-misconception-routing' branch`.

## [2026-06-09 09:27] Misconception Taxonomy Was Too Coarse
- Problem: Targeted repairs could only distinguish a small set of broad misconceptions, so different linear algebra errors were routed through generic labels and generic repair advice.
- Root Cause: The shared mistake catalog only covered sign slips, coordinate mix-ups, span counting, row-operation errors, eigenvector scaling, and setup mismatch.
- Solution: Added concept-specific misconception patterns for vector-equation translation, dependence relations, pivot/free-variable confusion, basis images as columns, zero-vector subspace checks, determinant order, singularity, null-space free variables, rank-nullity dimension, projection denominators, residual orthogonality, basis-coordinate weights, diagonalization cancellation, eigenvector nonzero rules, and proof closure gaps.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `README.md`, `docs/MVP_ROADMAP.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/CURRICULUM_SKILL_MAP.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms concept-specific final-answer and work-step misconception detection.

## [2026-06-09 09:27] Repair Variants Would Pollute Ordinary Practice
- Problem: Adding misconception-specific repair problems as normal problems would have made adaptive lesson sets show repair drills before a learner had demonstrated the relevant misconception.
- Root Cause: The problem model had no way to distinguish ordinary practice from repair-only variants.
- Solution: Added a `repairOnly` flag, excluded repair-only problems from normal concept lookup, and made targeted repair sets pull matching repair-only variants first.
- Files Changed: `src/domain/tutorEngine.ts`, `src/App.tsx`, `test/mathAnswer.test.ts`, `README.md`, `docs/MVP_ROADMAP.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/CURRICULUM_SKILL_MAP.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms ordinary adaptive sets exclude repair-only variants and targeted repair sets prioritize the matching repair drill.

## [2026-06-09 09:27] Generic Coordinate Pattern Shadowed Matrix Column Error
- Problem: A response that put basis-vector images in rows was classified as a generic coordinate mix-up instead of the more precise basis-images-as-columns misconception.
- Root Cause: The matrix transformation problem still referenced only the generic coordinate pattern, while the specific pattern had been attached to the wrong matrix problem during implementation.
- Solution: Moved the basis-images-as-columns pattern to the matrix-construction problem and left the diagonal scaling problem with the generic coordinate pattern.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms `mat-2` responses with row placement now return `basis-images-as-columns`.

## [2026-06-09 09:27] Repair Variant Ordering Preferred Prerequisites
- Problem: A systems sign-slip repair could show a prerequisite vector-equation drill before the same-concept systems sign repair.
- Root Cause: Focused repair variants were filtered across the active concept and prerequisites but kept problem-bank order instead of prioritizing the active repair concept.
- Solution: Sorted focused repair variants and focused core repair problems so same-concept items appear before prerequisite items.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms the sign-slip repair set starts with `sys-repair-sign`.

## [2026-06-09 09:27] Numeric Text Fallback Accepted Wrong Signed Answers
- Problem: The determinant response `det = 2 - 12 = -10` could be marked correct for an expected answer of `10` because loose text matching found `10` inside `-10`.
- Root Cause: Numeric problems used both structured numeric evaluation and substring-based accepted-answer fallback.
- Solution: Made structured numeric evaluation authoritative for number rubrics, while preserving text fallback for non-number rubrics.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms the wrong signed determinant answer is classified as `determinant-order-error` instead of correct.

## [2026-06-09 09:29] In-App Browser Surface Was Unavailable
- Problem: Browser verification for the repair-variant UI path could not run through the in-app browser because the browser plugin reported no available browser surfaces.
- Root Cause: Unknown; `agent.browsers.list()` returned an empty list during verification.
- Solution: Logged the verification limitation and used local automated tests, production build, lint, diff checks, and an HTTP check against the dev server as the validation path.
- Files Changed: `SOLUTIONS.md`
- Status: Workaround
- Verification: `curl -I http://127.0.0.1:5173/` returned HTTP 200, and `npm test`, `npm run build`, `npm run lint`, and `git diff --check` passed before the log entry.

## [2026-06-09 09:32] No Automated PR Checks Reported For Repair Variants PR
- Problem: GitHub reported no automated checks for PR #16, so validation for the repair-variants branch depends on local verification.
- Root Cause: Unknown; the repository still has no reported CI checks for pull requests.
- Solution: Logged the PR-specific occurrence and used local test, build, lint, diff, and HTTP verification as the validation path.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: `gh pr checks 16` returned `no checks reported on the 'codex/phase-2-repair-variants' branch`.

## [2026-06-09 09:51] README Planning Doc Links Broke On GitHub
- Problem: The planning-document links in `README.md` returned errors from the public GitHub repo.
- Root Cause: The links used absolute local filesystem paths under `/Users/atropea/Documents/Linear%20Algebra`, which GitHub cannot resolve as repository paths.
- Solution: Replaced the absolute paths with repo-relative Markdown links.
- Files Changed: `README.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `rg -n "/Users/atropea|Linear%20Algebra" README.md docs` returned no matches after the fix.

## [2026-06-09 09:52] No Automated PR Checks Reported For README Link Fix PR
- Problem: GitHub reported no automated checks for PR #17, so validation for the README link fix depends on local verification.
- Root Cause: Unknown; the repository still has no reported CI checks for pull requests.
- Solution: Logged the PR-specific occurrence and used local link-target, grep, and diff verification as the validation path.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: `gh pr checks 17` returned `no checks reported on the 'codex/fix-readme-planning-links' branch`.

## [2026-06-09 09:54] Link Target Check Clobbered Shell Path
- Problem: A final shell loop for checking GitHub link targets failed with `zsh:1: command not found: curl`.
- Root Cause: The loop variable was named `path`, which is a special zsh variable tied to command lookup paths.
- Solution: Reran the link-target check with a non-special loop variable name.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: The corrected loop checked all README planning-document target URLs successfully.

## [2026-06-11 13:05] Step Feedback Relied On Token Overlap
- Problem: Multi-step work could be marked on track when it shared words with a verified solution step but did not contain the mathematical evidence the step needed.
- Root Cause: `evaluateWorkStep` scored step work through normalized token overlap and compact string matching, with misconception triggers layered on afterward.
- Solution: Added `StepRubric` definitions with evidence groups, rubric details, and per-step next actions; updated work-step evaluation to use explicit rubric evidence before falling back to generated default rubrics; and added representative rubrics across coordinate setup, elimination, row reading, matrix construction, determinants, projections, rank-nullity, basis coordinates, diagonalization, and proof checks.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `README.md`, `docs/MVP_ROADMAP.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/PEDAGOGY_NOTES.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms rubric evidence rejects a vague overlapping step, accepts concise mathematical evidence, and keeps coherent proof work on track.

## [2026-06-11 13:05] Generic Step Triggers Shadowed Specific Rubrics
- Problem: A matrix-construction step that put basis-vector images in rows was still classified as a generic coordinate mix-up instead of the more precise basis-images-as-columns misconception.
- Root Cause: `classifyWorkStepMisconception` checked generic problem trigger matches before concept-specific work-step rules.
- Solution: Reordered work-step misconception classification so concept-specific rules run before generic trigger matching.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms row-placement work for `mat-2` now reports `basis-images-as-columns`.

## [2026-06-11 13:08] No Automated PR Checks Reported For Step Rubrics PR
- Problem: GitHub reported no automated checks for PR #18, so validation for the step-rubrics branch depends on local verification.
- Root Cause: Unknown; the repository still has no reported CI checks for pull requests.
- Solution: Logged the PR-specific occurrence and used local test, build, lint, and diff verification as the validation path.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: `gh pr checks 18` returned `no checks reported on the 'codex/phase-2-step-rubrics' branch`.

## [2026-06-13 10:44] Step Rubric Coverage Was Incomplete
- Problem: Many verified and repair-only problems still depended on generated fallback step rubrics instead of instructor-authored evidence rubrics.
- Root Cause: The previous milestone added representative concept-specific rubrics but did not cover every problem in `problemBank`.
- Solution: Added a keyed step-rubric library for every remaining verified problem and enriched `problemBank` so each problem now has one explicit rubric per solution step.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `README.md`, `docs/MVP_ROADMAP.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/PEDAGOGY_NOTES.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` includes `has explicit step rubrics for every verified problem`, which checks that every `problemBank` item has rubric coverage matching its solution steps.

## [2026-06-13 10:44] Work Step Feedback Could Not Distinguish Partial From Wrong Direction
- Problem: Work-step feedback only had `on-track` and `needs-work` outcomes, so an almost-complete step could be treated like a misconception or wrong-direction setup.
- Root Cause: Step evaluation used matched evidence counts without weighted scores, score thresholds, or a distinct partial status.
- Solution: Added rubric weights, required scores, partial thresholds, score metadata, a `partial` work-step state, partial-aware summaries, partial UI styling, and tests proving partial work does not create a misconception record when the final answer is correct.
- Files Changed: `src/domain/tutorEngine.ts`, `src/App.css`, `test/mathAnswer.test.ts`, `README.md`, `docs/MVP_ROADMAP.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/PEDAGOGY_NOTES.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` includes `distinguishes partial rubric progress from wrong-direction work` and `does not log partial work as a misconception when the final answer is correct`.

## [2026-06-13 10:44] Rubric Library Indexing Failed TypeScript
- Problem: The first test run failed with `TS7053` when enriching `problemBank` from `stepRubricLibrary[problem.id]`.
- Root Cause: `stepRubricLibrary` used `satisfies Partial<Record<string, StepRubric[]>>`, preserving literal keys without a string index signature for arbitrary problem ids.
- Solution: Gave `stepRubricLibrary` an explicit `Partial<Record<string, StepRubric[]>>` type annotation so indexing by `problem.id` is type-safe.
- Files Changed: `src/domain/tutorEngine.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` passed after the type annotation change.

## [2026-06-13 10:44] Verification Probes Used Stale Paths And Unsafe Shell Quoting
- Problem: Early verification probes failed with `zsh:1: bad substitution` for a Node one-liner and `rg` errors for root-level planning-doc paths that now live under `docs/`.
- Root Cause: The Node one-liner put a JavaScript template literal inside a double-quoted zsh command, and the file search included stale root paths for planning documents.
- Solution: Reran the Node probe with safe single-quoted JavaScript and used `rg --files` plus the actual `docs/` paths for planning-document inspection.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: The corrected Node probe printed rubric coverage counts, and subsequent `rg`/`sed` reads succeeded against the actual repository paths.

## [2026-06-13 10:44] Browser Smoke Test Ran Before Dev Server Was Available
- Problem: The in-app browser could not load `http://127.0.0.1:5173/`, and `curl -I http://127.0.0.1:5173/` failed to connect because nothing was serving that port.
- Root Cause: The local Vite dev server was not running when browser verification started.
- Solution: Started `npm run dev -- --host 127.0.0.1` and reloaded the app through the in-app browser.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: The in-app browser loaded the Linear Algebra Live Tutor page after the dev server started.

## [2026-06-13 10:44] Browser Automation Reused A Persistent Variable Name
- Problem: A browser automation cell failed with `Identifier 'text' has already been declared`.
- Root Cause: The browser control runtime keeps top-level JavaScript bindings between calls, and the smoke-test script reused a previous `const text` binding.
- Solution: Reran the smoke-test script with fresh `var` bindings for the temporary textarea and body-text variables.
- Files Changed: `SOLUTIONS.md`
- Status: Resolved
- Verification: The corrected browser script submitted the current visible problem and confirmed the app continued rendering.

## [2026-06-13 10:45] No Automated PR Checks Reported For Weighted Rubrics PR
- Problem: GitHub reported no automated checks for PR #19, so validation for the weighted-rubrics branch depends on local verification.
- Root Cause: Unknown; the repository still has no reported CI checks for pull requests.
- Solution: Logged the PR-specific occurrence and used local test, build, lint, diff, and browser smoke verification as the validation path.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: `gh pr checks 19` returned `no checks reported on the 'codex/phase-2-weighted-step-rubrics' branch`.

## [2026-06-13 11:15] Missing Evidence Entered The Repair Queue
- Problem: Vague work-step text that lacked rubric evidence could create a `setup-mismatch` misconception record, even when the final answer was correct.
- Root Cause: `evaluateWorkStep` used the setup-mismatch fallback both as guidance and as a logged misconception.
- Solution: Kept missing-evidence feedback as `needs-work` with a `Revise step` headline, but only attaches a misconception when a specific misconception trigger is present.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `docs/PEDAGOGY_NOTES.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` includes `does not log missing evidence as a misconception when the final answer is correct`.

## [2026-06-13 11:15] Rubrics Lacked Sample-Response Calibration
- Problem: The app had full rubric coverage, but there was no systematic sample-response validation proving each rubric handled complete, almost-complete, missing-evidence, and wrong-direction work.
- Root Cause: Previous tests covered representative examples rather than a calibration matrix for every problem.
- Solution: Added rubric calibration case generation, an audit summary, and tests that validate four sample work cases for each of the 40 verified problems.
- Files Changed: `src/domain/tutorEngine.ts`, `test/mathAnswer.test.ts`, `README.md`, `docs/MVP_ROADMAP.md`, `docs/PRODUCT_BLUEPRINT.md`, `docs/PEDAGOGY_NOTES.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms 160 calibration cases across 40 problems, including 37 partial cases and 40 misconception cases.

## [2026-06-13 11:15] Verified Solution Text Failed Its Own Rubrics
- Problem: The new calibration suite failed because `span-1` and `proof-1` complete solution paths were not accepted by their own rubric evidence.
- Root Cause: Those rubrics required alternate words such as `same direction`, `multiples`, or `addition` that the verified solution targets did not always include.
- Solution: Added matching evidence phrases from the verified targets (`combinations` and `u and v are in W`) so complete solution paths score on track.
- Files Changed: `src/domain/tutorEngine.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` now passes `validates rubric calibration samples across every problem`.

## [2026-06-13 11:15] Valid Column Language Triggered Coordinate Misconceptions
- Problem: Valid work steps that mentioned `column`, such as matrix column placement or rank-nullity column counts, could be marked as coordinate mix-ups.
- Root Cause: The generic coordinate misconception trigger treated `column` as suspicious before considering that the rubric itself may require column language.
- Solution: Allowed evidence-backed coordinate language to continue into rubric scoring instead of immediately becoming a coordinate misconception.
- Files Changed: `src/domain/tutorEngine.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms complete calibration samples for matrix and rank-nullity problems stay on track while row-placement misconceptions still trigger repair.

## [2026-06-13 11:15] Single-Character Evidence Matched Inside Ordinary Words
- Problem: A one-character rubric evidence token such as `b` could match inside unrelated words like `because`, inflating rubric scores for wrong-direction work.
- Root Cause: `evidenceChoiceMatches` used substring and compact-string matching for all evidence choices, including single alphanumeric tokens.
- Solution: Required single-character alphanumeric evidence to match as its own token boundary before falling back to broader substring matching for longer evidence.
- Files Changed: `src/domain/tutorEngine.ts`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `npm test` confirms the least-squares wrong-direction calibration case now triggers residual-orthogonality repair instead of scoring on track.

## [2026-06-13 11:16] No Automated PR Checks Reported For Rubric Calibration PR
- Problem: GitHub reported no automated checks for PR #20, so validation for the rubric-calibration branch depends on local verification.
- Root Cause: Unknown; the repository still has no reported CI checks for pull requests.
- Solution: Logged the PR-specific occurrence and used local test, build, lint, and diff verification as the validation path.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: `gh pr checks 20` returned `no checks reported on the 'codex/phase-2-rubric-calibration' branch`.

## [2026-06-13 13:51] GitHub Pages Was Not Enabled
- Problem: The repository did not have an active GitHub Pages site, so the planned public demo URL could not deploy yet.
- Root Cause: Pages had not been configured for the repository; `gh api repos/anntropea-oss/linear-algebra-training-studio/pages` returned HTTP 404.
- Solution: Enabled GitHub Pages with GitHub Actions as the build type and set the repository homepage to `https://anntropea-oss.github.io/linear-algebra-training-studio/`.
- Files Changed: `.github/workflows/pages.yml`, `package.json`, `README.md`, `docs/GITHUB_PAGES_DEPLOYMENT.md`, `docs/MVP_ROADMAP.md`, `docs/PRODUCT_BLUEPRINT.md`, `SOLUTIONS.md`
- Status: Resolved
- Verification: `gh api --method POST repos/anntropea-oss/linear-algebra-training-studio/pages -f build_type=workflow` returned the Pages configuration with `build_type: workflow`, `public: true`, and HTTPS enforced; `gh repo view --json homepageUrl` returned the public demo URL.

## [2026-06-13 13:53] No Automated PR Checks Reported For GitHub Pages PR
- Problem: GitHub reported no automated checks for PR #21, so validation for the GitHub Pages setup branch depends on local verification before merge and the post-merge Pages deployment run.
- Root Cause: The new Pages workflow deploys on pushes to `main`; it does not run for pull requests.
- Solution: Logged the PR-specific limitation and used local install, test, Pages build, lint, and diff verification before merge.
- Files Changed: `SOLUTIONS.md`
- Status: Open
- Verification: `gh pr checks 21` returned `no checks reported on the 'codex/setup-github-pages' branch`.
