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
