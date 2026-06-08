# Product Blueprint

## Objective

Build a real-time linear algebra tutor that lets a learner start anywhere, solve problems immediately, receive feedback while working, and build a durable record of mastery, mistakes, repairs, and next steps.

## Core Loop

1. Learner chooses a starting point.
2. App opens the concept lesson for that point.
3. Learner reads the big idea, definitions, theory, and worked example.
4. App unlocks the adaptive problem set after the learner starts practice.
5. Learner works in the answer box.
6. Live coach reacts to the answer in real time.
7. Learner asks for guided support if they are stuck.
8. Learner submits the attempt.
9. App updates mastery, confidence, lesson completion, support used, mistake records, repair queue, and next problem set recommendations.

## Primary Experience

The first screen is not an instructor dashboard. It is a learning cockpit:

- starting point selector
- concept path
- theory lesson before practice
- definitions and worked examples
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
- what concept the problem tests
- what mistake pattern appeared
- how many hints or guided steps the learner used
- whether the learner needed hints
- whether the next problem should repair, review, or challenge

## Current MVP

- Single learner profile persisted locally.
- Multiple active problem sets.
- Concept lessons gate problem practice.
- Real-time response evaluation.
- Guided solution function for stuck learners.
- Adaptive, repair, and challenge set generation.
- Mistake detection for common early patterns.
- Mastery and confidence tracking by concept.
- Repair queue with resolution.

## Next Product Step

Replace keyword scoring with stronger math-aware evaluation:

- structured numeric parsing
- vector/matrix answer normalization
- step-by-step work capture
- instructor-reviewed rubrics
- optional AI explanation layer over verified problem templates
