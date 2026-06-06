# Pedagogy Notes

This project is not just a homework generator. The hard part is building a trustworthy learner model.

## What Is Easy To Underestimate

### Placement Is Multi-Dimensional

A learner might compute row reductions well but have weak geometric intuition. Avoid one total level as the only placement signal. Store mastery by skill.

### Correct Answers Are Not Enough

A learner can get an answer right by pattern matching. Capture explanations, confidence, time, hint use, and whether the learner can transfer the idea to a new context.

### Mistakes Need Categories

Do not log only "wrong." Track the type of mistake:

- arithmetic slip
- notation confusion
- procedure error
- concept mismatch
- prerequisite gap
- overgeneralization
- incomplete justification

### Spaced Review Matters

Mastery decays. A skill should return to the review queue after time passes, especially if it supports later concepts.

### Hints Are Learning Evidence

A correct answer after three hints is different from a correct answer without hints. Store hint count and hint type.

### Confidence Changes The Intervention

Wrong and confident means misconception. Wrong and unsure may mean missing fluency. Correct and unsure means fragile knowledge.

### Problem Difficulty Must Be Calibrated

Difficulty should not be guessed from topic alone. Track how often templates are missed and how long they take.

### Transfer Is The Real Test

Learners should solve:

- direct practice
- mixed-topic practice
- explanation prompts
- reverse problems
- application problems
- error-analysis problems

### Gamification Can Backfire

Progress bars and streaks are useful, but the system should reward repair, persistence, and reflection, not speed alone.

## Recommended Instructional Signals

Store these for each attempt:

- answer
- score
- confidence before
- confidence after
- time spent
- hints used
- mistake category
- solution viewed
- retry count
- instructor comment

## Recommended Assignment Mix

A strong adaptive homework set should include:

- 40 percent current weak skill
- 25 percent prerequisite repair
- 20 percent spaced review
- 15 percent transfer or challenge

## Instructor Controls

Add controls for:

- lock next topic
- exclude a topic temporarily
- add custom note
- adjust mastery manually
- assign remediation packet
- mark a misconception resolved

## AI Use Guidance

Use AI carefully:

- Good use: explain a verified solution in a different style.
- Good use: classify a learner's written mistake for instructor review.
- Good use: draft problem variants that humans verify.
- Risky use: generate unverified math problems and answer keys.
- Risky use: grade free response without rubrics or review.

## North Star

The system should always be able to answer:

- What does this learner understand?
- What evidence supports that claim?
- What mistake pattern is blocking progress?
- What should they practice next?
- What should they review later?
- What did the system change after the latest attempt?
