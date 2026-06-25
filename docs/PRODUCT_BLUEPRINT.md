# Product Blueprint

## Objective

Build a real-time linear algebra tutor that lets a learner start anywhere, solve problems immediately, receive feedback while working, and build a durable record of mastery, mistakes, repairs, and next steps.

## Core Loop

1. Learner chooses an initial starting point.
2. Learner completes a short diagnostic placement check.
3. App recommends a starting concept and flags prerequisite repairs.
4. App separates the experience into focused Learn, Practice, and Progress workspaces.
5. App places the concept lecture in the Learn workspace.
6. Learner studies the big idea, definitions, three-part lecture, and two worked examples.
7. Learner solves a free-response try-it problem and receives explanatory feedback.
8. Learner passes lesson checks whose answer positions do not reveal the key.
9. App unlocks the adaptive problem set and records the try-it as the first solved item.
10. Learner chooses free-work mode or guided-step mode in Practice.
11. Live coach reacts to the final answer in real time.
12. Learner asks for guided support if they are stuck.
13. Learner submits the attempt.
14. App updates mastery, confidence, lesson completion, support used, mistake records, repair queue, and next problem set recommendations.

## Primary Experience

The first screen is not an instructor dashboard. It is a learning cockpit:

- starting point selector
- focused Learn, Practice, and Progress workspaces
- theory lesson before practice
- definitions and multiple worked examples with step rationales
- free-response try-it problem before lesson checks
- lesson checks before practice unlocks
- active problem sets
- optional free-work scratchpad
- optional guided step-by-step workspace
- live coach feedback
- hints and worked solution steps
- AI-style guided solution steps when the learner does not know how to begin
- placement diagnostic
- prerequisite readiness map
- concept path
- repair queue
- progress by concept
- recent attempts and activity

## Instructional Model

The app should care about evidence:

- what answer the learner tried
- whether the prerequisite lesson was read
- whether lesson checks were passed
- which diagnostic concepts were strengths or repair targets
- what concept the problem tests
- what mistake pattern appeared
- how many hints or guided steps the learner used
- whether the learner needed hints
- whether the next problem should repair, review, or challenge

## Current MVP

- Single learner profile persisted locally.
- Multiple active problem sets.
- Concept lessons gate problem practice.
- Learn, Practice, and Progress are separated into focused workspaces.
- Diagnostic placement recommends a starting concept.
- Prerequisite map shows readiness for advanced concepts.
- Lesson checks gate practice after theory.
- Stable varied choice order prevents answer-position shortcuts.
- Guided solution steps explain why each next move follows.
- University-level concept map extends through determinants, inverses, fundamental subspaces, rank-nullity, least squares, change of basis, diagonalization, and proof techniques.
- Real-time response evaluation.
- Guided solution function for stuck learners.
- Free-work mode lets learners use an ungraded scratchpad and submit only the final answer.
- Adaptive, repair, and challenge set generation.
- Mistake detection for common early patterns.
- Step-by-step work capture with misconception tags.
- Concept-specific weighted step rubrics for multi-step work feedback.
- Partial step scoring that distinguishes almost-complete work from wrong-direction work.
- Rubric calibration samples for complete, partial, missing-evidence, and misconception cases.
- Targeted repair sets from the next open misconception.
- Repair-only problem variants prioritized for the active misconception.
- Mastery and confidence tracking by concept.
- Repair queue with resolution.
- Public GitHub Pages demo for ongoing testing and sharing.

## Next Product Step

Deepen math-aware evaluation and adaptive repair:

- keep the GitHub Pages demo green after each `main` merge
- learner-data review of rubric weights and partial thresholds
- larger instructor-reviewed repair bank
- adaptive difficulty inside each misconception repair path
- optional AI explanation layer over verified problem templates

## App Path

Start with the GitHub Pages web demo while the tutor is changing quickly. After the core learning data model is stable, add a PWA manifest, install icons, and offline-safe caching. Native app packaging should wait until the browser version has durable accounts and predictable sync behavior.
