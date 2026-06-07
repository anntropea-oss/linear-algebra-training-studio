# Pedagogy Notes

The rebuilt app focuses on real-time learning, not after-the-fact reporting.

## Key Principles

- Start from the learner's actual entry point.
- Make partial work visible and useful.
- Give feedback before the learner submits.
- Reveal help progressively when the learner does not know how to begin.
- Separate arithmetic slips from conceptual misunderstandings.
- Treat mistakes as repair targets, not failures.
- Use the next problem to respond to the latest evidence.

## Current Mistake Patterns

- Sign or arithmetic slip.
- Coordinate mix-up.
- Counting vectors instead of directions.
- Invalid row operation.
- Eigenvectors treated as unchanged instead of scaled.

## Feedback Timing

Live feedback should change while the learner types:

- idle: no work yet
- working: relevant structure appears
- mistake: a known misconception appears
- correct: answer matches the target idea

## Guided Support

The current guide is template-grounded rather than connected to a live LLM. That is intentional for the MVP: every guided reveal comes from a verified problem, hint, target skill, or worked solution step.

When a learner asks for help, the tutor should:

- orient the learner to the task
- ask for the first setup move
- reveal one step at a time
- preserve the learner's work area
- record guided steps used on submission

## What Still Needs Depth

- Better parsing for equivalent algebraic answers.
- Matrix-specific answer checking.
- More concept-specific misconceptions.
- Problem variants that adapt difficulty within a session.
- A way for learners to enter multi-step work, not just final answers.
- A backend AI layer that can explain verified steps without inventing math.
