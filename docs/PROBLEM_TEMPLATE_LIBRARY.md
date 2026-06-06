# Problem Template Library

Issue: #3

The problem library is now normalized into verified templates. The original problem bank remains readable in `src/data/learningModel.ts`, and each template is enriched at runtime with metadata.

## Template Fields

- template ID
- skill ID
- prompt
- hint
- solution
- difficulty
- checks-for statement
- misconception category
- evidence mode
- transfer type
- rubric ID
- estimated minutes
- active flag

## Evidence Modes

- compute
- explain
- justify
- diagnose-error
- transfer

## Transfer Types

- direct practice
- prerequisite repair
- spaced review
- mixed transfer
- challenge

## Generator Behavior

The assignment generator considers:

- current mastery
- confidence
- recent mistakes
- prerequisite gaps
- review debt
- template difficulty
- transfer type

Homework now carries enough metadata for grading, analytics, and future template calibration.
