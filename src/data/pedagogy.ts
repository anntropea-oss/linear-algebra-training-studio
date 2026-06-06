export type MisconceptionCategoryId =
  | 'arithmetic-slip'
  | 'notation-confusion'
  | 'procedure-error'
  | 'concept-mismatch'
  | 'prerequisite-gap'
  | 'overgeneralization'
  | 'incomplete-justification'

export type EvidenceMode =
  | 'compute'
  | 'explain'
  | 'justify'
  | 'diagnose-error'
  | 'transfer'

export type TransferType =
  | 'direct-practice'
  | 'prerequisite-repair'
  | 'spaced-review'
  | 'mixed-transfer'
  | 'challenge'

export type RubricId =
  | 'linear-combination-rubric'
  | 'span-independence-rubric'
  | 'systems-row-rubric'
  | 'structure-rubric'
  | 'geometry-rubric'
  | 'spectral-rubric'

export type MisconceptionCategory = {
  id: MisconceptionCategoryId
  label: string
  description: string
  evidenceSignals: string[]
  intervention: string
}

export type RubricCriterion = {
  id: string
  label: string
  points: number
  evidence: string
}

export type Rubric = {
  id: RubricId
  name: string
  skillFamilies: string[]
  criteria: RubricCriterion[]
  partialCreditNotes: string
}

export const misconceptionTaxonomy: MisconceptionCategory[] = [
  {
    id: 'arithmetic-slip',
    label: 'Arithmetic slip',
    description: 'The method is appropriate, but a sign, scalar, or simple calculation failed.',
    evidenceSignals: [
      'Correct setup followed by a small numerical error.',
      'The learner can explain the idea after correction.',
    ],
    intervention: 'Give brief correction, then repeat with lower arithmetic load.',
  },
  {
    id: 'notation-confusion',
    label: 'Notation confusion',
    description: 'Symbols, matrix shapes, or coordinate notation are being read incorrectly.',
    evidenceSignals: [
      'Confuses rows with columns.',
      'Uses a formula with undefined dimensions.',
    ],
    intervention: 'Add notation translation before computation.',
  },
  {
    id: 'procedure-error',
    label: 'Procedure error',
    description: 'The learner knows the target but applies an invalid or incomplete procedure.',
    evidenceSignals: [
      'Invalid row operation.',
      'Uses determinant or projection formula with a missing term.',
    ],
    intervention: 'Use a worked example plus one immediate near-transfer problem.',
  },
  {
    id: 'concept-mismatch',
    label: 'Concept mismatch',
    description: 'The answer reveals a wrong mental model of the concept.',
    evidenceSignals: [
      'Treats span as a count of vectors.',
      'Thinks eigenvectors are unchanged instead of scaled.',
    ],
    intervention: 'Return to representation, geometry, and explanation prompts.',
  },
  {
    id: 'prerequisite-gap',
    label: 'Prerequisite gap',
    description: 'A later skill is blocked by an earlier skill that is not secure.',
    evidenceSignals: [
      'Projection errors caused by dot product weakness.',
      'Diagonalization errors caused by basis or independence weakness.',
    ],
    intervention: 'Assign prerequisite repair before more target-topic practice.',
  },
  {
    id: 'overgeneralization',
    label: 'Overgeneralization',
    description: 'A rule that works in one context is being applied too broadly.',
    evidenceSignals: [
      'Assumes every square matrix is diagonalizable.',
      'Uses slope rules for orthogonality outside R^2.',
    ],
    intervention: 'Contrast examples and counterexamples.',
  },
  {
    id: 'incomplete-justification',
    label: 'Incomplete justification',
    description: 'The learner reaches a plausible answer without enough evidence.',
    evidenceSignals: [
      'Gives a yes or no answer without checking closure or independence.',
      'States a basis without explaining span and independence.',
    ],
    intervention: 'Require a two-part justification rubric before credit.',
  },
]

export const rubrics: Rubric[] = [
  {
    id: 'linear-combination-rubric',
    name: 'Linear combination and vector reasoning',
    skillFamilies: ['Vectors and linear combinations'],
    criteria: [
      {
        id: 'setup',
        label: 'Sets up the combination correctly',
        points: 2,
        evidence: 'Writes the target vector as a weighted sum or coordinate equation.',
      },
      {
        id: 'solve',
        label: 'Solves scalar conditions accurately',
        points: 2,
        evidence: 'Finds weights or explains why no weights exist.',
      },
      {
        id: 'interpret',
        label: 'Interprets the result',
        points: 1,
        evidence: 'Connects the computation to reachability, direction, or coordinates.',
      },
    ],
    partialCreditNotes:
      'Give setup credit even when arithmetic fails. Withhold interpretation credit for purely mechanical answers.',
  },
  {
    id: 'span-independence-rubric',
    name: 'Span, independence, basis, and dimension',
    skillFamilies: ['Span', 'Linear independence', 'Basis and dimension'],
    criteria: [
      {
        id: 'representation',
        label: 'Represents the vector relationship',
        points: 2,
        evidence: 'Uses equations, row reduction, scalar multiples, or geometry.',
      },
      {
        id: 'redundancy',
        label: 'Identifies redundancy or missing directions',
        points: 2,
        evidence: 'Finds a dependence relation, pivot pattern, or counterexample.',
      },
      {
        id: 'conclusion',
        label: 'States the conclusion with justification',
        points: 1,
        evidence: 'Explains span, independence, basis, or dimension in context.',
      },
    ],
    partialCreditNotes:
      'Do not give full credit for a correct yes or no without evidence.',
  },
  {
    id: 'systems-row-rubric',
    name: 'Systems, row reduction, and matrix operations',
    skillFamilies: ['Systems of equations', 'Row reduction', 'Matrix operations'],
    criteria: [
      {
        id: 'translation',
        label: 'Translates the task into matrix or equation form',
        points: 1,
        evidence: 'Shows equations, augmented matrix, or dimension check.',
      },
      {
        id: 'procedure',
        label: 'Uses valid operations',
        points: 3,
        evidence: 'Applies legal row operations or row-column multiplication.',
      },
      {
        id: 'readout',
        label: 'Reads the solution structure',
        points: 1,
        evidence: 'Identifies solution, inconsistency, free variables, rank, or shape.',
      },
    ],
    partialCreditNotes:
      'Invalid row operations cap the score at setup credit until repaired.',
  },
  {
    id: 'structure-rubric',
    name: 'Subspaces and determinants',
    skillFamilies: ['Subspaces', 'Determinants'],
    criteria: [
      {
        id: 'conditions',
        label: 'Checks required conditions',
        points: 2,
        evidence: 'Checks zero vector, closure, determinant, or invertibility condition.',
      },
      {
        id: 'calculation',
        label: 'Computes accurately when needed',
        points: 1,
        evidence: 'Performs determinant or closure calculation correctly.',
      },
      {
        id: 'meaning',
        label: 'Explains structural meaning',
        points: 2,
        evidence: 'Connects the result to collapse, scale, subspace, or dimension.',
      },
    ],
    partialCreditNotes:
      'A subspace answer must address all required closure conditions for full credit.',
  },
  {
    id: 'geometry-rubric',
    name: 'Transformations, orthogonality, and projections',
    skillFamilies: ['Linear transformations', 'Orthogonality', 'Projections and least squares'],
    criteria: [
      {
        id: 'model',
        label: 'Chooses the right geometric model',
        points: 2,
        evidence: 'Uses columns, dot product, projection formula, kernel, or image appropriately.',
      },
      {
        id: 'compute',
        label: 'Computes the requested object',
        points: 2,
        evidence: 'Finds output vector, dot product, projection, or least-squares meaning.',
      },
      {
        id: 'interpret',
        label: 'Interprets the geometry',
        points: 1,
        evidence: 'Explains rotation, scaling, perpendicularity, closest vector, or collapse.',
      },
    ],
    partialCreditNotes:
      'Full credit requires both computation and geometric interpretation.',
  },
  {
    id: 'spectral-rubric',
    name: 'Eigenvalues, eigenvectors, and diagonalization',
    skillFamilies: ['Eigenvalues and eigenvectors', 'Diagonalization'],
    criteria: [
      {
        id: 'equation',
        label: 'Uses the correct spectral equation',
        points: 2,
        evidence: 'Uses Av = lambda v, det(A - lambda I), or A = PDP^-1 correctly.',
      },
      {
        id: 'basis-check',
        label: 'Checks eigenspace and basis requirements',
        points: 2,
        evidence: 'Finds enough independent eigenvectors or identifies why not.',
      },
      {
        id: 'application',
        label: 'Explains why the result matters',
        points: 1,
        evidence: 'Connects diagonalization to repeated transformations or coordinate change.',
      },
    ],
    partialCreditNotes:
      'Eigenvalues alone are not enough for full diagonalization credit.',
  },
]

export const defaultMisconceptionBySkill: Record<string, MisconceptionCategoryId> = {
  'vec-combinations': 'notation-confusion',
  span: 'concept-mismatch',
  'linear-independence': 'concept-mismatch',
  systems: 'arithmetic-slip',
  'row-reduction': 'procedure-error',
  'matrix-operations': 'notation-confusion',
  subspaces: 'incomplete-justification',
  'basis-dimension': 'incomplete-justification',
  'linear-transformations': 'concept-mismatch',
  orthogonality: 'overgeneralization',
  projections: 'prerequisite-gap',
  determinants: 'concept-mismatch',
  eigen: 'overgeneralization',
  diagonalization: 'overgeneralization',
}

export const rubricBySkill: Record<string, RubricId> = {
  'vec-combinations': 'linear-combination-rubric',
  span: 'span-independence-rubric',
  'linear-independence': 'span-independence-rubric',
  systems: 'systems-row-rubric',
  'row-reduction': 'systems-row-rubric',
  'matrix-operations': 'systems-row-rubric',
  subspaces: 'structure-rubric',
  'basis-dimension': 'span-independence-rubric',
  'linear-transformations': 'geometry-rubric',
  orthogonality: 'geometry-rubric',
  projections: 'geometry-rubric',
  determinants: 'structure-rubric',
  eigen: 'spectral-rubric',
  diagonalization: 'spectral-rubric',
}

export const getRubric = (rubricId: RubricId) =>
  rubrics.find((rubric) => rubric.id === rubricId) ?? rubrics[0]

export const getMisconceptionCategory = (categoryId: MisconceptionCategoryId) =>
  misconceptionTaxonomy.find((category) => category.id === categoryId) ??
  misconceptionTaxonomy[0]
