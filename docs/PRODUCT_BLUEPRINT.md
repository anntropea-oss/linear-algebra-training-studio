# Product Blueprint

## Objective

Build a real-time linear algebra tutor that lets a learner start anywhere, solve problems immediately, receive feedback while working, and build a durable record of mastery, mistakes, repairs, and next steps.

## Core Loop

1. Learner chooses a starting point.
2. App creates an adaptive problem set for that point.
3. Learner works in the answer box.
4. Live coach reacts to the answer in real time.
5. Learner submits the attempt.
6. App updates mastery, confidence, mistake records, repair queue, and next problem set recommendations.

## Primary Experience

The first screen is not an instructor dashboard. It is a learning cockpit:

- starting point selector
- concept path
- active problem sets
- live coach feedback
- hints and worked solution steps
- repair queue
- progress by concept
- recent attempts and activity

## Instructional Model

The app should care about evidence:

- what answer the learner tried
- what concept the problem tests
- what mistake pattern appeared
- whether the learner needed hints
- whether the next problem should repair, review, or challenge

## Current MVP

- Single learner profile persisted locally.
- Multiple active problem sets.
- Real-time response evaluation.
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
