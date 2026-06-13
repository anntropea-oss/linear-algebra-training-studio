# Product Blueprint

## Objective

Build a real-time linear algebra tutor that lets a learner start anywhere, solve problems immediately, receive feedback while working, and build a durable record of mastery, mistakes, repairs, and next steps.

## Core Loop

1. Learner chooses an initial starting point.
2. Learner completes a short diagnostic placement check.
3. App recommends a starting concept and flags prerequisite repairs.
4. App opens the concept lesson for that point.
5. Learner reads the big idea, definitions, theory, and worked example.
6. Learner passes lesson checks.
7. App unlocks the adaptive problem set.
8. Learner works in the answer box.
9. Live coach reacts to the answer in real time.
10. Learner asks for guided support if they are stuck.
11. Learner submits the attempt.
12. App updates mastery, confidence, lesson completion, support used, mistake records, repair queue, and next problem set recommendations.

## Primary Experience

The first screen is not an instructor dashboard. It is a learning cockpit:

- starting point selector
- placement diagnostic
- prerequisite readiness map
- concept path
- theory lesson before practice
- definitions and worked examples
- lesson checks before practice unlocks
- active problem sets
- live coach feedback
- hints and worked solution steps
- AI-style guided solution steps when the learner does not know how to begin
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
- Diagnostic placement recommends a starting concept.
- Prerequisite map shows readiness for advanced concepts.
- Lesson checks gate practice after theory.
- University-level concept map extends through determinants, inverses, fundamental subspaces, rank-nullity, least squares, change of basis, diagonalization, and proof techniques.
- Real-time response evaluation.
- Guided solution function for stuck learners.
- Adaptive, repair, and challenge set generation.
- Mistake detection for common early patterns.
- Step-by-step work capture with misconception tags.
- Concept-specific weighted step rubrics for multi-step work feedback.
- Partial step scoring that distinguishes almost-complete work from wrong-direction work.
- Targeted repair sets from the next open misconception.
- Repair-only problem variants prioritized for the active misconception.
- Mastery and confidence tracking by concept.
- Repair queue with resolution.

## Next Product Step

Deepen math-aware evaluation and adaptive repair:

- instructor review of rubric weights and partial thresholds
- larger instructor-reviewed repair bank
- adaptive difficulty inside each misconception repair path
- optional AI explanation layer over verified problem templates
