# MVP Roadmap

## Phase 0: Prototype

Status: current repo

- React dashboard.
- Sample learners.
- In-memory skill states.
- Adaptive homework generator.
- Downloadable HTML homework.
- Practice and mistake logging.

## Phase 1: Durable MVP

Goal: a real app that can safely track a small group of learners.

- Add persistence with PostgreSQL.
- Add authentication.
- Add roles: learner, instructor, admin.
- Store assignments, attempts, mistakes, and activity events.
- Add server-side homework export.
- Add seed problem-template library.
- Add basic diagnostic assessment.

## Phase 2: Instructional Quality

Goal: make adaptation trustworthy.

- Build misconception taxonomy.
- Add rubrics for partial credit.
- Add confidence-before and confidence-after prompts.
- Add spaced review scheduler.
- Add instructor review queue.
- Add manual override for next recommended skill.
- Add versioning for problem templates and generator rules.

## Phase 3: Learner Experience

Goal: make the system useful and motivating.

- Add learner-facing assignment view.
- Add hints and worked examples.
- Add progress celebrations that reward persistence and repair.
- Add reflection prompts after repeated mistakes.
- Add downloadable study packets by topic.
- Add mobile-friendly practice mode.

## Phase 4: Analytics

Goal: help instructors improve instruction.

- Add cohort heatmaps.
- Add common-mistake reports.
- Add time-to-mastery by skill.
- Add retention and review-effectiveness charts.
- Add template difficulty calibration.
- Add exportable learner progress reports.

## Phase 5: AI Assistance

Goal: use AI where it helps without weakening mathematical reliability.

- Classify free-response mistakes into misconception tags.
- Draft alternate explanations from verified solutions.
- Suggest new problem-template variants for human review.
- Summarize weekly progress for instructors.
- Generate learner-specific study plans from stored evidence.

## Production Readiness Checklist

- Verified problem library.
- Automated tests for the assignment generator.
- Accessibility pass.
- Backup and restore.
- Audit logging.
- Data export and deletion.
- FERPA-aware data handling if used in formal education.
- Clear policy for AI-generated instructional text.
