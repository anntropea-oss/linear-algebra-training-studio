# Rebuild Analysis

## What The Logs Showed

The first prototype accumulated useful pieces: GitHub tracking, assignment planning, a problem template library, learner submissions, diagnostics, persistence notes, and instructor analytics. Those pieces were directionally relevant, but they pulled the product toward an administrative training system before the learner had a strong practice experience.

The user's latest goal is more direct:

- let a learner start from any level
- put active problem sets in front of them immediately
- give feedback while they work
- track progress, mistakes, repairs, and solutions
- use that evidence to decide what to teach next

## Restart Decision

The rebuild starts with the learner loop instead of the tracking backend. The app should feel like a math workspace first and a reporting system second.

The MVP is now:

1. Choose a starting point.
2. Generate an active set for that entry point.
3. Work problems in real time.
4. Receive live coaching, hints, and worked solution steps.
5. Submit attempts and record evidence.
6. Create repair, review, or challenge sets from that evidence.

## What Changed

- Removed the old instructor/admin dashboard direction.
- Removed planning docs that described a backend-heavy prototype.
- Added a domain-level tutor engine with concepts, problems, feedback, mistakes, and mastery updates.
- Added browser-local learner storage so progress persists without requiring accounts yet.
- Rebuilt the UI around the active problem set and live coaching loop.

## Product Guardrails

- Do not add instructor analytics before the learner practice loop is stronger.
- Do not add AI-generated math until the app has verified templates and answer checking.
- Do not treat a correct final answer as enough evidence; capture hints, attempts, mistake types, and repairs.
- Do not make progress bars decorative; they should respond to submitted work.
- Do not let tracking replace teaching.

## Next Build Direction

The next real unlock is math-aware answer parsing:

- normalize vectors, matrices, spans, and equations
- accept equivalent correct answers
- evaluate multi-step work
- distinguish arithmetic slips from concept errors
- author larger verified problem banks by concept and difficulty

