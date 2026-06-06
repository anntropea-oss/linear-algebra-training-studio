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
