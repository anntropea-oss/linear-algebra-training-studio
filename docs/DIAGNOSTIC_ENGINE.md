# Diagnostic Engine

Issue: #2

The diagnostic engine currently uses the skill graph and learner state to produce a placement report. It is ready to accept real diagnostic responses later.

## Current Outputs

- placement score
- placement label
- ready skills
- review skills
- repair skills
- recommended next steps

## Placement Bands

- Spectral readiness
- Bridge readiness
- Foundations readiness
- Repair-first readiness

## Evidence Used

- skill mastery
- confidence
- review debt
- skill diagnostic prompt
- default misconception category
- skill rubric

## Implementation

Source: `src/data/learningModel.ts`

Functions:

- `diagnosticItems`
- `buildDiagnosticReport`
- `applyDiagnosticCheckpoint`

The app exposes a `Diagnostic` button that records a checkpoint and updates learner placement evidence.
