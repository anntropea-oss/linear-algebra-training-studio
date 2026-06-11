# Pedagogy Notes

The rebuilt app focuses on real-time learning, not after-the-fact reporting.

## Key Principles

- Start from the learner's actual entry point.
- Teach the concept before asking the learner to perform it.
- Use definitions, intuition, and worked examples before independent practice.
- Diagnose the learner before trusting their self-placement.
- Require short checks for understanding before unlocking practice.
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

## Lesson Before Practice

Each concept begins with:

- a big idea in plain language
- why the concept matters
- essential definitions
- core theory statements
- a worked example
- readiness checks before the answer box appears

Practice is intentionally gated until the lesson is marked complete. This does not prove mastery, but it prevents the app from treating linear algebra as only a problem generator.

## Diagnostic Placement

The current diagnostic is short and conceptual. It should be used as a routing signal, not a grade:

- correct answers mark strengths
- missed answers mark repair targets
- the first missed concept becomes the recommended starting point
- diagnostic results should not erase prior learning history

## Prerequisite Awareness

Each concept has prerequisites from the concept graph. A concept is considered ready when prerequisite lessons are complete and prerequisite mastery is at least developing. This gives the tutor a reason to route backward when a learner is stuck.

## University-Level Coverage

The course map now includes the topics a first serious linear algebra course expects: determinants, inverses, the four fundamental subspaces, rank-nullity, orthogonality, least squares, eigenvalues, change of basis, diagonalization, and proof habits. The next instructional risk is depth, not breadth: each topic needs more problems, more representations, and more misconception-specific repair paths.

## What Still Needs Depth

- Better parsing for equivalent algebraic answers.
- Matrix-specific answer checking.
- More concept-specific misconceptions.
- Problem variants that adapt difficulty within a session.
- More instructor-reviewed step rubrics for advanced topics and transfer problems.
- A backend AI layer that can explain verified steps without inventing math.
- More robust lesson sequencing with short checks for understanding before unlocking practice.
