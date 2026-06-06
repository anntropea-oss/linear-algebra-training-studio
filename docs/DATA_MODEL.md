# Data Model

This prototype keeps data in memory, but the shapes below are intended to become database tables.

## Learners

Tracks identity and high-level placement.

- id
- name
- cohort
- level_name
- diagnostic_score
- weekly_goal_minutes
- created_at
- updated_at

## Skills

Stores the curriculum graph.

- id
- name
- stage
- level
- prerequisites
- mastery_goal
- diagnostic_prompt

## Learner Skill States

Stores the current model of a learner's knowledge.

- learner_id
- skill_id
- mastery
- confidence
- attempts
- last_practiced_at
- trend

## Problem Templates

Stores verified problem families.

- id
- skill_id
- difficulty
- prompt_template
- parameters_schema
- hint_template
- solution_template
- checks_for
- rubric
- active

## Assignments

Stores generated homework sets.

- id
- learner_id
- title
- created_at
- due_at
- estimated_minutes
- focus_skill_ids
- generator_version

## Assignment Problems

Stores the exact problems assigned.

- id
- assignment_id
- skill_id
- prompt
- hint
- solution
- difficulty
- checks_for
- display_order

## Attempts

Stores learner work on problems.

- id
- learner_id
- assignment_problem_id
- submitted_answer
- is_correct
- score
- confidence_before
- confidence_after
- time_spent_seconds
- hint_count
- submitted_at

## Mistakes

Stores actionable error evidence.

- id
- learner_id
- skill_id
- problem_id
- misconception
- learner_answer
- correction
- severity
- status
- created_at
- resolved_at

## Activity Events

Stores the full learning log.

- id
- learner_id
- type
- title
- detail
- metadata
- created_at

## Instructor Notes

Stores human context that the algorithm should not infer.

- id
- learner_id
- author_id
- note
- visibility
- created_at

## Recommendation Inputs

The assignment generator should consider:

- mastery by skill
- confidence by skill
- recent mistakes
- prerequisite gaps
- time since last practice
- diagnostic placement
- instructor overrides
- skill importance
- assignment fatigue
- prior exposure to problem templates

## Privacy Notes

If real learners use this system, treat learning records as sensitive educational data. Add role-based access, audit logs, retention rules, and export/delete workflows before production use.
