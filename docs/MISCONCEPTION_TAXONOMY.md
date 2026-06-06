# Misconception Taxonomy and Rubrics

Issue: #5

The training system now treats mistakes as instructional evidence. Each mistake is tagged with a category, status, severity, learner answer, correction, and related skill.

## Misconception Categories

- Arithmetic slip: correct method, small numerical failure.
- Notation confusion: matrix shape, coordinate, row/column, or symbol confusion.
- Procedure error: invalid or incomplete algorithmic step.
- Concept mismatch: wrong mental model of the concept.
- Prerequisite gap: current topic blocked by an earlier fragile skill.
- Overgeneralization: a valid rule applied outside its domain.
- Incomplete justification: plausible answer without enough evidence.

## Rubric Families

- Linear combination and vector reasoning.
- Span, independence, basis, and dimension.
- Systems, row reduction, and matrix operations.
- Subspaces and determinants.
- Transformations, orthogonality, and projections.
- Eigenvalues, eigenvectors, and diagonalization.

## Implementation

Source: `src/data/pedagogy.ts`

The app uses:

- `misconceptionTaxonomy`
- `rubrics`
- `defaultMisconceptionBySkill`
- `rubricBySkill`

These are wired into assignments, mistakes, submissions, diagnostics, and instructor analytics.

## Instructional Rule

Do not treat "wrong" as a sufficient record. A useful record should say:

- what the learner tried
- what misconception it suggests
- what rubric evidence was missing
- what correction or intervention should happen next
