import { evaluateMathAnswer } from './mathAnswer.js'
import type { MathAnswerSpec } from './mathAnswer.js'

export type ConceptId =
  | 'vectors'
  | 'span'
  | 'systems'
  | 'row-reduction'
  | 'matrix-transformations'
  | 'determinants'
  | 'inverses'
  | 'subspaces'
  | 'fundamental-subspaces'
  | 'rank-nullity'
  | 'orthogonality'
  | 'least-squares'
  | 'eigenvalues'
  | 'change-of-basis'
  | 'diagonalization'
  | 'proof-techniques'

export type SetMode = 'adaptive' | 'repair' | 'challenge'

export type ProblemStatus = 'ready' | 'answered'

export type ProblemSetStatus = 'active' | 'completed'

export type FeedbackTone = 'idle' | 'working' | 'mistake' | 'correct'

export type Concept = {
  id: ConceptId
  title: string
  shortTitle: string
  level: number
  prerequisites: ConceptId[]
  target: string
}

export type ConceptLesson = {
  conceptId: ConceptId
  bigIdea: string
  whyItMatters: string
  definitions: Array<{
    term: string
    meaning: string
  }>
  theory: string[]
  workedExample: {
    prompt: string
    steps: string[]
    takeaway: string
  }
  readinessChecks: string[]
}

export type LessonCheckQuestion = {
  id: string
  conceptId: ConceptId
  prompt: string
  choices: Array<{
    id: string
    label: string
  }>
  correctChoiceId: string
  correctFeedback: string
  incorrectFeedback: string
}

export type LessonCheckRecord = {
  conceptId: ConceptId
  completedAt?: string
  attempts: number
  responses: Record<string, string>
  passed: boolean
}

export type DiagnosticQuestion = {
  id: string
  conceptId: ConceptId
  prompt: string
  choices: Array<{
    id: string
    label: string
  }>
  correctChoiceId: string
  repairIfMissed: ConceptId
  feedback: string
}

export type DiagnosticReport = {
  completedAt: string
  score: number
  total: number
  recommendedStart: ConceptId
  strengths: ConceptId[]
  repairs: ConceptId[]
  responses: Record<string, string>
}

export type PrerequisiteStatus = {
  conceptId: ConceptId
  title: string
  mastery: number
  lessonComplete: boolean
  ready: boolean
}

export type MistakePattern = {
  id: string
  label: string
  triggers: string[]
  feedback: string
  repair: string
}

export type Problem = {
  id: string
  conceptId: ConceptId
  prompt: string
  answerType: 'number' | 'vector' | 'choice' | 'explanation'
  accepted: string[]
  expectedAnswer?: MathAnswerSpec
  mustInclude?: string[]
  hint: string
  deeperHint: string
  solutionSteps: string[]
  checksFor: string
  mistakePatterns: MistakePattern[]
  difficulty: 1 | 2 | 3
}

export type ProblemProgress = {
  problemId: string
  status: ProblemStatus
  response: string
  workSteps: string[]
  score: number
  hintsUsed: number
  guideStepsUsed: number
  submittedAt?: string
}

export type ProblemSet = {
  id: string
  title: string
  mode: SetMode
  conceptId: ConceptId
  repairFocus?: {
    misconceptionId: string
    label: string
  }
  createdAt: string
  status: ProblemSetStatus
  problemIds: string[]
  progress: Record<string, ProblemProgress>
}

export type Attempt = {
  id: string
  problemId: string
  conceptId: ConceptId
  response: string
  workSteps: string[]
  score: number
  feedback: string
  hintsUsed: number
  guideStepsUsed: number
  mistakeLabel?: string
  misconceptionId?: string
  misconceptionLabel?: string
  createdAt: string
}

export type MistakeRecord = {
  id: string
  conceptId: ConceptId
  problemId: string
  label: string
  feedback: string
  repair: string
  response: string
  misconceptionId?: string
  source?: 'final-answer' | 'work-step'
  stepIndex?: number
  evidence?: string
  createdAt: string
  resolved: boolean
}

export type ActivityRecord = {
  id: string
  createdAt: string
  title: string
  detail: string
}

export type LearnerProfile = {
  name: string
  startingPoint: ConceptId
  currentConceptId: ConceptId
  mastery: Record<ConceptId, number>
  confidence: Record<ConceptId, number>
  lessonReads: Partial<Record<ConceptId, string>>
  lessonCheckRecords: Partial<Record<ConceptId, LessonCheckRecord>>
  diagnostic?: DiagnosticReport
  problemSets: ProblemSet[]
  attempts: Attempt[]
  mistakes: MistakeRecord[]
  activity: ActivityRecord[]
}

export type LiveFeedback = {
  tone: FeedbackTone
  headline: string
  detail: string
  nextAction: string
  score: number
  mistake?: MistakePattern
  matchedAccepted: boolean
}

export type GuidedSolutionStep = {
  id: string
  title: string
  coachPrompt: string
  support: string
  reveal: string
  check: string
}

export type GuidedSolution = {
  problemId: string
  headline: string
  nudge: string
  steps: GuidedSolutionStep[]
  revealedSteps: GuidedSolutionStep[]
  nextStep?: GuidedSolutionStep
  completed: boolean
}

export type WorkStepStatus = 'empty' | 'on-track' | 'needs-work'

export type WorkStepFeedback = {
  index: number
  response: string
  expected: string
  status: WorkStepStatus
  detail: string
  nextAction: string
  misconception?: MistakePattern
}

export type WorkStepReport = {
  problemId: string
  headline: string
  detail: string
  nextAction: string
  answered: number
  onTrack: number
  total: number
  feedback: WorkStepFeedback[]
  misconception?: {
    pattern: MistakePattern
    stepIndex: number
    evidence: string
  }
}

export const concepts: Concept[] = [
  {
    id: 'vectors',
    title: 'Vectors and Linear Combinations',
    shortTitle: 'Vectors',
    level: 1,
    prerequisites: [],
    target: 'Build vectors from weighted directions and explain the weights.',
  },
  {
    id: 'span',
    title: 'Span and Linear Independence',
    shortTitle: 'Span',
    level: 1,
    prerequisites: ['vectors'],
    target: 'Decide what a group of vectors can reach and whether any are redundant.',
  },
  {
    id: 'systems',
    title: 'Systems of Equations',
    shortTitle: 'Systems',
    level: 2,
    prerequisites: ['vectors'],
    target: 'Solve systems and explain whether the answer is unique, absent, or infinite.',
  },
  {
    id: 'row-reduction',
    title: 'Row Reduction and Rank',
    shortTitle: 'Rows',
    level: 2,
    prerequisites: ['systems'],
    target: 'Use legal row operations to expose pivots, free variables, and rank.',
  },
  {
    id: 'matrix-transformations',
    title: 'Matrices as Transformations',
    shortTitle: 'Transforms',
    level: 3,
    prerequisites: ['vectors', 'systems'],
    target: 'Connect matrix columns to how space moves.',
  },
  {
    id: 'determinants',
    title: 'Determinants and Area Scaling',
    shortTitle: 'Determinants',
    level: 3,
    prerequisites: ['matrix-transformations', 'row-reduction'],
    target: 'Use determinants to detect invertibility and measure signed scaling.',
  },
  {
    id: 'inverses',
    title: 'Inverses and Matrix Equations',
    shortTitle: 'Inverses',
    level: 3,
    prerequisites: ['row-reduction', 'matrix-transformations'],
    target: 'Decide when a matrix can undo a transformation and solve Ax = b.',
  },
  {
    id: 'subspaces',
    title: 'Subspaces, Basis, and Dimension',
    shortTitle: 'Subspaces',
    level: 3,
    prerequisites: ['span', 'row-reduction'],
    target: 'Verify subspaces and describe them with efficient bases.',
  },
  {
    id: 'fundamental-subspaces',
    title: 'Column Space, Null Space, Row Space, and Left Null Space',
    shortTitle: '4 Subspaces',
    level: 4,
    prerequisites: ['subspaces', 'row-reduction'],
    target: 'Connect a matrix to the four subspaces that organize its behavior.',
  },
  {
    id: 'rank-nullity',
    title: 'Rank-Nullity and Dimension Accounting',
    shortTitle: 'Rank-Nullity',
    level: 4,
    prerequisites: ['fundamental-subspaces'],
    target: 'Use dimension relationships to explain pivots, freedom, and solution shape.',
  },
  {
    id: 'orthogonality',
    title: 'Orthogonality and Projections',
    shortTitle: 'Projection',
    level: 5,
    prerequisites: ['vectors', 'subspaces'],
    target: 'Use dot products to measure perpendicularity and closest vectors.',
  },
  {
    id: 'least-squares',
    title: 'Least Squares and Best Approximation',
    shortTitle: 'Least Squares',
    level: 6,
    prerequisites: ['orthogonality', 'systems'],
    target: 'Approximate inconsistent systems with projections and normal equations.',
  },
  {
    id: 'eigenvalues',
    title: 'Eigenvalues and Eigenvectors',
    shortTitle: 'Eigen',
    level: 6,
    prerequisites: ['determinants', 'matrix-transformations', 'subspaces'],
    target: 'Find directions that stay on their own line under a transformation.',
  },
  {
    id: 'change-of-basis',
    title: 'Change of Basis and Coordinates',
    shortTitle: 'Basis Change',
    level: 6,
    prerequisites: ['subspaces', 'matrix-transformations'],
    target: 'Translate vectors and transformations between coordinate systems.',
  },
  {
    id: 'diagonalization',
    title: 'Diagonalization and Powers of Matrices',
    shortTitle: 'Diagonalize',
    level: 7,
    prerequisites: ['eigenvalues', 'change-of-basis'],
    target: 'Use eigenvectors as a basis to simplify repeated matrix action.',
  },
  {
    id: 'proof-techniques',
    title: 'Proof Techniques for Linear Algebra',
    shortTitle: 'Proofs',
    level: 7,
    prerequisites: ['subspaces', 'rank-nullity'],
    target: 'Write clear arguments from definitions, counterexamples, and dimension facts.',
  },
]

export const lessonLibrary: Record<ConceptId, ConceptLesson> = {
  vectors: {
    conceptId: 'vectors',
    bigIdea:
      'A vector is a quantity with direction and size. In linear algebra, vectors are the basic objects we add together and scale.',
    whyItMatters:
      'Almost every later topic asks what happens when you combine vectors: whether they can reach a target, solve a system, describe a space, or move under a matrix.',
    definitions: [
      {
        term: 'Vector',
        meaning: 'An ordered list of numbers, often interpreted as a direction or point.',
      },
      {
        term: 'Scalar',
        meaning: 'A number that stretches, shrinks, flips, or weights a vector.',
      },
      {
        term: 'Linear combination',
        meaning: 'A sum of scaled vectors, such as a v + b w.',
      },
    ],
    theory: [
      'To add vectors, add matching coordinates. To scale a vector, multiply every coordinate by the scalar.',
      'A linear combination asks how much of each vector is needed to build a target vector.',
      'Solving a vector equation usually means turning each coordinate into its own scalar equation.',
    ],
    workedExample: {
      prompt: 'Find a and b so that a(1, 0) + b(0, 1) = (3, -2).',
      steps: [
        'Scale each vector: a(1, 0) = (a, 0) and b(0, 1) = (0, b).',
        'Add them: (a, 0) + (0, b) = (a, b).',
        'Match coordinates with (3, -2), so a = 3 and b = -2.',
      ],
      takeaway:
        'The coefficients in a linear combination are the weights that build the target.',
    },
    readinessChecks: [
      'Can you identify the vectors and scalars in a linear combination?',
      'Can you turn a vector equation into coordinate equations?',
    ],
  },
  span: {
    conceptId: 'span',
    bigIdea:
      'The span of a set of vectors is every vector you can build from their linear combinations.',
    whyItMatters:
      'Span tells you what directions are reachable. Independence tells you whether any listed vector is redundant.',
    definitions: [
      {
        term: 'Span',
        meaning: 'The full collection of vectors reachable by linear combinations.',
      },
      {
        term: 'Linear independence',
        meaning: 'No vector in the set can be built from the others.',
      },
      {
        term: 'Dependence',
        meaning: 'At least one vector repeats information already supplied by the others.',
      },
    ],
    theory: [
      'Two vectors in R2 span the whole plane only when they point in genuinely different directions.',
      'Counting vectors is not enough; three vectors on the same line still span only a line.',
      'A dependence relation means there is a nonzero way to combine the vectors and get zero.',
    ],
    workedExample: {
      prompt: 'Do (1, 2) and (2, 4) span all of R2?',
      steps: [
        'Notice (2, 4) = 2(1, 2).',
        'Both vectors point along the same line.',
        'Their combinations can move forward and backward on that line, but not off it.',
      ],
      takeaway: 'They span a line, not all of R2.',
    },
    readinessChecks: [
      'Can you spot when one vector is a multiple of another?',
      'Can you explain reachable directions instead of only counting vectors?',
    ],
  },
  systems: {
    conceptId: 'systems',
    bigIdea:
      'A system of equations asks for values that satisfy every equation at the same time.',
    whyItMatters:
      'Systems are the computational form of many vector and matrix questions. They reveal whether a target can be built from given directions.',
    definitions: [
      {
        term: 'Solution',
        meaning: 'A value or vector that makes every equation true.',
      },
      {
        term: 'Consistent',
        meaning: 'The system has at least one solution.',
      },
      {
        term: 'Inconsistent',
        meaning: 'The equations contradict each other, so there is no solution.',
      },
    ],
    theory: [
      'Solving a system means preserving the same solution set while making the equations easier.',
      'A unique solution appears when every variable is forced.',
      'No solution appears when the equations produce a contradiction, such as 0 = 5.',
    ],
    workedExample: {
      prompt: 'Solve x + y = 5 and x - y = 1.',
      steps: [
        'Add the equations: 2x = 6.',
        'So x = 3.',
        'Substitute into x + y = 5 to get y = 2.',
      ],
      takeaway: 'The solution is (3, 2), and it must satisfy both equations.',
    },
    readinessChecks: [
      'Can you check a proposed solution in every equation?',
      'Can you tell the difference between unique, infinite, and no solutions?',
    ],
  },
  'row-reduction': {
    conceptId: 'row-reduction',
    bigIdea:
      'Row reduction rewrites a system into an equivalent, easier system using legal row operations.',
    whyItMatters:
      'It is the main hand tool for solving systems, finding rank, identifying pivots, and describing solution spaces.',
    definitions: [
      {
        term: 'Pivot',
        meaning: 'A leading nonzero entry that anchors a variable or direction.',
      },
      {
        term: 'Free variable',
        meaning: 'A variable without a pivot, allowed to vary as a parameter.',
      },
      {
        term: 'Rank',
        meaning: 'The number of pivot directions in a matrix.',
      },
    ],
    theory: [
      'Legal row operations are row swaps, multiplying a row by a nonzero scalar, and adding a multiple of one row to another.',
      'Row operations preserve the solution set of the system.',
      'Pivot columns identify forced variables; non-pivot columns identify freedom.',
    ],
    workedExample: {
      prompt: 'Read x + 2y = 5 and y = 1.',
      steps: [
        'The second equation already says y = 1.',
        'Substitute into the first equation: x + 2(1) = 5.',
        'So x = 3.',
      ],
      takeaway: 'A pivot structure lets you solve from the simplest rows upward.',
    },
    readinessChecks: [
      'Can you name the three legal row operations?',
      'Can you explain what a non-pivot variable means?',
    ],
  },
  'matrix-transformations': {
    conceptId: 'matrix-transformations',
    bigIdea:
      'A matrix is a machine that transforms input vectors into output vectors.',
    whyItMatters:
      'This connects computation to geometry: matrices can stretch, rotate, shear, project, or collapse space.',
    definitions: [
      {
        term: 'Matrix-vector product',
        meaning: 'A linear combination of the matrix columns using the input coordinates as weights.',
      },
      {
        term: 'Standard basis',
        meaning: 'The coordinate directions e1, e2, and so on.',
      },
      {
        term: 'Linear transformation',
        meaning: 'A rule that preserves vector addition and scalar multiplication.',
      },
    ],
    theory: [
      'The columns of a matrix tell you where the standard basis vectors go.',
      'Multiplying A by x combines the columns of A using the coordinates of x.',
      'If the columns collapse into fewer directions, the transformation loses dimension.',
    ],
    workedExample: {
      prompt: 'What does [[2, 0], [0, 3]] do to (x, y)?',
      steps: [
        'The first coordinate is multiplied by 2.',
        'The second coordinate is multiplied by 3.',
        'So the output is (2x, 3y).',
      ],
      takeaway: 'A diagonal matrix scales coordinate directions independently.',
    },
    readinessChecks: [
      'Can you read matrix columns as images of basis vectors?',
      'Can you multiply a 2 by 2 matrix by a vector?',
    ],
  },
  determinants: {
    conceptId: 'determinants',
    bigIdea:
      'A determinant is a signed scaling factor: it tells how a square matrix changes area, volume, or orientation.',
    whyItMatters:
      'Determinants give a fast test for invertibility and connect row reduction, geometry, and eigenvalue computations.',
    definitions: [
      {
        term: 'Determinant',
        meaning: 'A scalar attached to a square matrix that measures signed scaling.',
      },
      {
        term: 'Singular',
        meaning: 'A square matrix with determinant zero, so it collapses space.',
      },
      {
        term: 'Orientation',
        meaning: 'The handedness of space; a negative determinant flips it.',
      },
    ],
    theory: [
      'For a 2 by 2 matrix [[a, b], [c, d]], the determinant is ad - bc.',
      'A determinant of zero means the columns are dependent and the matrix is not invertible.',
      'Row swaps flip the determinant sign; scaling a row scales the determinant.',
    ],
    workedExample: {
      prompt: 'Find det([[2, 1], [3, 4]]).',
      steps: [
        'Use ad - bc.',
        'Compute 2(4) - 1(3).',
        'The determinant is 8 - 3 = 5.',
      ],
      takeaway: 'A nonzero determinant means this 2 by 2 matrix is invertible.',
    },
    readinessChecks: [
      'Can you compute a 2 by 2 determinant?',
      'Can you explain why determinant zero means lost dimension?',
    ],
  },
  inverses: {
    conceptId: 'inverses',
    bigIdea:
      'An inverse matrix undoes a transformation: applying A and then A inverse gets you back where you started.',
    whyItMatters:
      'Inverses solve matrix equations, but only when the transformation has not collapsed information.',
    definitions: [
      {
        term: 'Inverse',
        meaning: 'A matrix A inverse where A inverse A = I and A A inverse = I.',
      },
      {
        term: 'Identity matrix',
        meaning: 'The matrix that leaves every vector unchanged.',
      },
      {
        term: 'Invertible',
        meaning: 'A square matrix with an inverse.',
      },
    ],
    theory: [
      'A matrix is invertible exactly when Ax = b has a unique solution for every b.',
      'For square matrices, invertible is equivalent to having pivots in every column.',
      'If det(A) = 0, A has no inverse.',
    ],
    workedExample: {
      prompt: 'If A inverse exists and Ax = b, how do you solve for x?',
      steps: [
        'Start with Ax = b.',
        'Multiply both sides by A inverse on the left.',
        'A inverse A x = A inverse b, so x = A inverse b.',
      ],
      takeaway: 'An inverse lets you undo A, but the order of multiplication matters.',
    },
    readinessChecks: [
      'Can you state what an inverse matrix does?',
      'Can you connect invertibility to pivots or determinant?',
    ],
  },
  subspaces: {
    conceptId: 'subspaces',
    bigIdea:
      'A subspace is a smaller linear world inside a larger vector space, closed under the operations that define linear algebra.',
    whyItMatters:
      'Subspaces let us describe solution sets, column spaces, null spaces, and the structure hidden inside matrices.',
    definitions: [
      {
        term: 'Subspace',
        meaning: 'A set containing zero that is closed under vector addition and scalar multiplication.',
      },
      {
        term: 'Basis',
        meaning: 'An independent set of vectors that spans a space.',
      },
      {
        term: 'Dimension',
        meaning: 'The number of vectors in a basis.',
      },
    ],
    theory: [
      'Every subspace must contain the zero vector.',
      'If you add two vectors in a subspace, the result must stay in the subspace.',
      'A basis removes redundancy while preserving every reachable vector.',
    ],
    workedExample: {
      prompt: 'Is the line x + y = 0 a subspace of R2?',
      steps: [
        'The zero vector satisfies 0 + 0 = 0.',
        'Adding two vectors with coordinate sums zero gives another vector with coordinate sum zero.',
        'Scaling a vector with coordinate sum zero still has coordinate sum zero.',
      ],
      takeaway: 'The line x + y = 0 is a subspace.',
    },
    readinessChecks: [
      'Can you test whether zero is in a set?',
      'Can you explain closure under addition and scalar multiplication?',
    ],
  },
  'fundamental-subspaces': {
    conceptId: 'fundamental-subspaces',
    bigIdea:
      'Every matrix organizes information into four linked spaces: column space, null space, row space, and left null space.',
    whyItMatters:
      'These spaces explain what Ax can reach, what Ax sends to zero, and how equations fail or succeed.',
    definitions: [
      {
        term: 'Column space',
        meaning: 'All vectors reachable as Ax.',
      },
      {
        term: 'Null space',
        meaning: 'All input vectors x where Ax = 0.',
      },
      {
        term: 'Row space',
        meaning: 'The span of the rows of a matrix.',
      },
    ],
    theory: [
      'The column space lives in the output space; the null space lives in the input space.',
      'Pivot columns of the original matrix form a basis for the column space.',
      'Free variables describe the null space.',
    ],
    workedExample: {
      prompt: 'For A = [[1, 2], [0, 0]], what is the null space condition?',
      steps: [
        'Solve Ax = 0.',
        'The equation is x1 + 2x2 = 0.',
        'So x1 = -2x2, giving multiples of (-2, 1).',
      ],
      takeaway: 'The null space records inputs that the matrix collapses to zero.',
    },
    readinessChecks: [
      'Can you distinguish input space from output space?',
      'Can you explain what Ax = 0 means geometrically?',
    ],
  },
  'rank-nullity': {
    conceptId: 'rank-nullity',
    bigIdea:
      'Rank-nullity is dimension bookkeeping: pivot directions plus free directions equal the number of input variables.',
    whyItMatters:
      'It lets you reason about solution sets and transformations without solving every detail from scratch.',
    definitions: [
      {
        term: 'Rank',
        meaning: 'The dimension of the column space.',
      },
      {
        term: 'Nullity',
        meaning: 'The dimension of the null space.',
      },
      {
        term: 'Rank-nullity theorem',
        meaning: 'For an m by n matrix, rank(A) + nullity(A) = n.',
      },
    ],
    theory: [
      'Rank counts pivot variables; nullity counts free variables.',
      'The number n in rank-nullity is the number of columns, or input coordinates.',
      'A larger nullity means more directions collapse to zero.',
    ],
    workedExample: {
      prompt: 'A 3 by 5 matrix has rank 3. What is its nullity?',
      steps: [
        'Use rank + nullity = number of columns.',
        'So 3 + nullity = 5.',
        'The nullity is 2.',
      ],
      takeaway: 'Rank-nullity tracks how input dimensions split into pivots and freedom.',
    },
    readinessChecks: [
      'Can you identify whether to use rows or columns in rank-nullity?',
      'Can you connect free variables to nullity?',
    ],
  },
  orthogonality: {
    conceptId: 'orthogonality',
    bigIdea:
      'Orthogonality means perpendicularity, measured by the dot product.',
    whyItMatters:
      'Orthogonality powers projections, least squares, distances, and decomposing vectors into independent pieces.',
    definitions: [
      {
        term: 'Dot product',
        meaning: 'A coordinate-wise product sum that measures alignment.',
      },
      {
        term: 'Orthogonal',
        meaning: 'Two vectors with dot product zero.',
      },
      {
        term: 'Projection',
        meaning: 'The closest vector in a direction or subspace.',
      },
    ],
    theory: [
      'A positive dot product means vectors point generally together; a negative dot product means they oppose; zero means perpendicular.',
      'Projection answers: how much of this vector lies in that direction?',
      'The projection formula onto u is ((v dot u) / (u dot u))u.',
    ],
    workedExample: {
      prompt: 'Are (1, 2) and (2, -1) orthogonal?',
      steps: [
        'Compute the dot product: 1(2) + 2(-1).',
        'That equals 2 - 2 = 0.',
        'Dot product zero means orthogonal.',
      ],
      takeaway: 'Orthogonality is checked by a dot product, not by visual guessing.',
    },
    readinessChecks: [
      'Can you compute a dot product?',
      'Can you explain what dot product zero means geometrically?',
    ],
  },
  'least-squares': {
    conceptId: 'least-squares',
    bigIdea:
      'Least squares solves inconsistent systems by finding the closest possible fit.',
    whyItMatters:
      'It is the linear algebra behind regression, data fitting, and approximate solutions when exact equations conflict.',
    definitions: [
      {
        term: 'Residual',
        meaning: 'The error vector b - Ax.',
      },
      {
        term: 'Least squares solution',
        meaning: 'A vector x that minimizes the length of b - Ax.',
      },
      {
        term: 'Normal equations',
        meaning: 'The equations A^T A x = A^T b.',
      },
    ],
    theory: [
      'The best approximation projects b onto the column space of A.',
      'At the best fit, the residual is orthogonal to every column of A.',
      'The normal equations encode that orthogonality condition.',
    ],
    workedExample: {
      prompt: 'What condition does a least-squares residual satisfy?',
      steps: [
        'Let r = b - Ax.',
        'At the best fit, r is perpendicular to the column space of A.',
        'That means A^T r = 0, so A^T A x = A^T b.',
      ],
      takeaway: 'Least squares turns best fit into an orthogonality equation.',
    },
    readinessChecks: [
      'Can you identify the residual vector?',
      'Can you explain why best approximation uses orthogonality?',
    ],
  },
  eigenvalues: {
    conceptId: 'eigenvalues',
    bigIdea:
      'Eigenvectors are special directions that a matrix only scales; eigenvalues are the scale factors.',
    whyItMatters:
      'Eigen ideas explain repeated transformations, stability, vibration, principal directions, and many advanced applications.',
    definitions: [
      {
        term: 'Eigenvector',
        meaning: 'A nonzero vector v where Av stays on the same line as v.',
      },
      {
        term: 'Eigenvalue',
        meaning: 'The scalar lambda in Av = lambda v.',
      },
      {
        term: 'Characteristic equation',
        meaning: 'An equation used to find eigenvalues.',
      },
    ],
    theory: [
      'Most vectors change direction under a matrix. Eigenvectors do not; they only stretch, shrink, or flip.',
      'The zero vector is excluded because it would make every scalar look like an eigenvalue.',
      'The equation Av = lambda v is the definition to keep returning to.',
    ],
    workedExample: {
      prompt: 'If Av = 4v for nonzero v, what is the eigenvalue?',
      steps: [
        'Compare Av = 4v with Av = lambda v.',
        'The scalar multiplying v is lambda.',
        'So the eigenvalue is 4.',
      ],
      takeaway: 'An eigenvalue is the scaling factor on an eigenvector.',
    },
    readinessChecks: [
      'Can you state why eigenvectors must be nonzero?',
      'Can you recognize the scalar lambda in Av = lambda v?',
    ],
  },
  'change-of-basis': {
    conceptId: 'change-of-basis',
    bigIdea:
      'Changing basis means describing the same vector with different coordinate measuring sticks.',
    whyItMatters:
      'A smart basis can make transformations simpler, reveal structure, and make diagonalization possible.',
    definitions: [
      {
        term: 'Coordinate vector',
        meaning: 'The list of weights needed to build a vector from a chosen basis.',
      },
      {
        term: 'Change-of-basis matrix',
        meaning: 'A matrix that translates coordinates from one basis to another.',
      },
      {
        term: 'Similarity',
        meaning: 'Two matrices related by A = P D P inverse, representing the same transformation in different bases.',
      },
    ],
    theory: [
      'Coordinates depend on the basis, but the vector itself does not.',
      'If P has basis vectors as columns, then x = P[x]_B.',
      'Changing basis often turns a hard-looking matrix into a simpler one.',
    ],
    workedExample: {
      prompt: 'If basis B is {(2, 0), (0, 3)}, what are the B-coordinates of (4, 6)?',
      steps: [
        'Find weights a and b with a(2, 0) + b(0, 3) = (4, 6).',
        'Match coordinates: 2a = 4 and 3b = 6.',
        'So [x]_B = (2, 2).',
      ],
      takeaway: 'Coordinates are weights relative to the chosen basis.',
    },
    readinessChecks: [
      'Can you distinguish a vector from its coordinates?',
      'Can you build a vector from basis weights?',
    ],
  },
  diagonalization: {
    conceptId: 'diagonalization',
    bigIdea:
      'Diagonalization uses eigenvectors as a basis so a matrix acts like simple coordinate-by-coordinate scaling.',
    whyItMatters:
      'It makes matrix powers, repeated processes, and many differential or discrete systems easier to understand.',
    definitions: [
      {
        term: 'Diagonalizable',
        meaning: 'A matrix with enough independent eigenvectors to form a basis.',
      },
      {
        term: 'Eigenbasis',
        meaning: 'A basis made of eigenvectors.',
      },
      {
        term: 'Diagonal matrix',
        meaning: 'A matrix with nonzero entries only on the main diagonal.',
      },
    ],
    theory: [
      'If A = P D P inverse, then the columns of P are eigenvectors and D contains eigenvalues.',
      'A diagonal matrix is easy to power: raise each diagonal entry to the power.',
      'A matrix can have eigenvalues but still fail to be diagonalizable if it lacks enough eigenvectors.',
    ],
    workedExample: {
      prompt: 'If A = P D P inverse, what is A squared?',
      steps: [
        'Compute A^2 = (P D P inverse)(P D P inverse).',
        'The middle P inverse P becomes I.',
        'So A^2 = P D^2 P inverse.',
      ],
      takeaway: 'Diagonalization makes repeated multiplication simple.',
    },
    readinessChecks: [
      'Can you identify P and D in A = P D P inverse?',
      'Can you explain why eigenvectors make a diagonal basis?',
    ],
  },
  'proof-techniques': {
    conceptId: 'proof-techniques',
    bigIdea:
      'Linear algebra proofs turn definitions into arguments, often by proving closure, independence, spanning, or dimension facts.',
    whyItMatters:
      'Proof skill separates procedural calculation from real mathematical understanding.',
    definitions: [
      {
        term: 'Direct proof',
        meaning: 'A proof that starts from assumptions and applies definitions to reach the claim.',
      },
      {
        term: 'Counterexample',
        meaning: 'A single example showing that a universal claim is false.',
      },
      {
        term: 'If and only if',
        meaning: 'A statement requiring proof in both directions.',
      },
    ],
    theory: [
      'Most subspace proofs require zero, closure under addition, and closure under scalar multiplication.',
      'To prove independence, start with a linear combination equal to zero and show all coefficients are zero.',
      'To disprove a statement, one clear counterexample is enough.',
    ],
    workedExample: {
      prompt: 'How would you disprove "every set containing zero is a subspace"?',
      steps: [
        'Find a set that contains zero but fails closure.',
        'For example, {(0, 0), (1, 0)} contains zero.',
        'But (1, 0) + (1, 0) = (2, 0), which is not in the set.',
      ],
      takeaway: 'A counterexample must satisfy the setup and break the conclusion.',
    },
    readinessChecks: [
      'Can you name the three subspace proof checks?',
      'Can you explain why one counterexample disproves a universal claim?',
    ],
  },
}

export const prerequisiteGraph: Record<ConceptId, ConceptId[]> =
  Object.fromEntries(
    concepts.map((concept) => [concept.id, concept.prerequisites]),
  ) as Record<ConceptId, ConceptId[]>

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 'diag-vectors',
    conceptId: 'vectors',
    prompt: 'What is 3(2, -1) - (1, 4)?',
    choices: [
      { id: 'a', label: '(5, -7)' },
      { id: 'b', label: '(6, -3)' },
      { id: 'c', label: '(7, 1)' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'vectors',
    feedback: 'Vector operations require matching coordinates and scaling every coordinate.',
  },
  {
    id: 'diag-span',
    conceptId: 'span',
    prompt: 'If two nonzero vectors in R2 are scalar multiples, what do they span?',
    choices: [
      { id: 'a', label: 'All of R2' },
      { id: 'b', label: 'A line through the origin' },
      { id: 'c', label: 'Only the zero vector' },
    ],
    correctChoiceId: 'b',
    repairIfMissed: 'span',
    feedback: 'Span depends on independent directions, not just how many vectors are listed.',
  },
  {
    id: 'diag-systems',
    conceptId: 'systems',
    prompt: 'Solve x + y = 4 and x - y = 2.',
    choices: [
      { id: 'a', label: '(2, 2)' },
      { id: 'b', label: '(3, 1)' },
      { id: 'c', label: 'No solution' },
    ],
    correctChoiceId: 'b',
    repairIfMissed: 'systems',
    feedback: 'A system solution must satisfy every equation at the same time.',
  },
  {
    id: 'diag-row',
    conceptId: 'row-reduction',
    prompt: 'In row-reduced form, what does a variable without a pivot usually mean?',
    choices: [
      { id: 'a', label: 'It is a free variable' },
      { id: 'b', label: 'The system has no variables' },
      { id: 'c', label: 'The row operation was illegal' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'row-reduction',
    feedback: 'Non-pivot columns usually correspond to free variables.',
  },
  {
    id: 'diag-matrix',
    conceptId: 'matrix-transformations',
    prompt: 'In a matrix transformation, what do the columns of the matrix tell you?',
    choices: [
      { id: 'a', label: 'Where the standard basis vectors go' },
      { id: 'b', label: 'Only the determinant' },
      { id: 'c', label: 'The final answer to every system' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'matrix-transformations',
    feedback: 'Matrix columns are the images of the standard basis vectors.',
  },
  {
    id: 'diag-det',
    conceptId: 'determinants',
    prompt: 'What is det([[1, 2], [3, 4]])?',
    choices: [
      { id: 'a', label: '-2' },
      { id: 'b', label: '10' },
      { id: 'c', label: '2' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'determinants',
    feedback: 'For [[a, b], [c, d]], the determinant is ad - bc.',
  },
  {
    id: 'diag-inverse',
    conceptId: 'inverses',
    prompt: 'If a square matrix has determinant zero, what can you conclude?',
    choices: [
      { id: 'a', label: 'It is not invertible' },
      { id: 'b', label: 'It is always the identity' },
      { id: 'c', label: 'It has no columns' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'inverses',
    feedback: 'A determinant of zero means the matrix collapses information and has no inverse.',
  },
  {
    id: 'diag-subspace',
    conceptId: 'subspaces',
    prompt: 'Why is {(x, y): x + y = 1} not a subspace of R2?',
    choices: [
      { id: 'a', label: 'It does not contain the zero vector' },
      { id: 'b', label: 'It has too many points' },
      { id: 'c', label: 'Every line is never a subspace' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'subspaces',
    feedback: 'Every subspace must contain the zero vector.',
  },
  {
    id: 'diag-four-subspaces',
    conceptId: 'fundamental-subspaces',
    prompt: 'Which space contains all vectors b that can be written as Ax?',
    choices: [
      { id: 'a', label: 'Column space' },
      { id: 'b', label: 'Null space' },
      { id: 'c', label: 'Left null space only' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'fundamental-subspaces',
    feedback: 'The column space is the set of all reachable outputs Ax.',
  },
  {
    id: 'diag-rank-nullity',
    conceptId: 'rank-nullity',
    prompt: 'A matrix has 6 columns and rank 4. What is its nullity?',
    choices: [
      { id: 'a', label: '2' },
      { id: 'b', label: '4' },
      { id: 'c', label: '10' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'rank-nullity',
    feedback: 'Rank plus nullity equals the number of columns.',
  },
  {
    id: 'diag-orth',
    conceptId: 'orthogonality',
    prompt: 'What does it mean when two vectors have dot product zero?',
    choices: [
      { id: 'a', label: 'They are orthogonal' },
      { id: 'b', label: 'They are equal' },
      { id: 'c', label: 'They cannot be vectors' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'orthogonality',
    feedback: 'Dot product zero means perpendicular directions.',
  },
  {
    id: 'diag-least-squares',
    conceptId: 'least-squares',
    prompt: 'In least squares, what is minimized?',
    choices: [
      { id: 'a', label: 'The length of the residual b - Ax' },
      { id: 'b', label: 'The number of rows only' },
      { id: 'c', label: 'The determinant of b' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'least-squares',
    feedback: 'Least squares minimizes the residual error when Ax = b cannot be solved exactly.',
  },
  {
    id: 'diag-eigen',
    conceptId: 'eigenvalues',
    prompt: 'If Av = -2v for nonzero v, what is the eigenvalue?',
    choices: [
      { id: 'a', label: '-2' },
      { id: 'b', label: 'v' },
      { id: 'c', label: '0' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'eigenvalues',
    feedback: 'The eigenvalue is the scalar multiplying the eigenvector.',
  },
  {
    id: 'diag-change-basis',
    conceptId: 'change-of-basis',
    prompt: 'What changes when you change basis?',
    choices: [
      { id: 'a', label: 'The coordinates describing a vector' },
      { id: 'b', label: 'The vector itself disappears' },
      { id: 'c', label: 'Only the number of rows' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'change-of-basis',
    feedback: 'Changing basis changes coordinate descriptions, not the underlying vector.',
  },
  {
    id: 'diag-diagonalization',
    conceptId: 'diagonalization',
    prompt: 'What must a matrix have to be diagonalizable?',
    choices: [
      { id: 'a', label: 'Enough independent eigenvectors to form a basis' },
      { id: 'b', label: 'Only one row' },
      { id: 'c', label: 'A zero determinant in every case' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'diagonalization',
    feedback: 'Diagonalization needs an eigenbasis.',
  },
  {
    id: 'diag-proofs',
    conceptId: 'proof-techniques',
    prompt: 'What is enough to disprove a statement that says "for every vector..."?',
    choices: [
      { id: 'a', label: 'One valid counterexample' },
      { id: 'b', label: 'A longer calculation with no example' },
      { id: 'c', label: 'Repeating the statement' },
    ],
    correctChoiceId: 'a',
    repairIfMissed: 'proof-techniques',
    feedback: 'A universal claim is false if one counterexample satisfies the setup and breaks the conclusion.',
  },
]

export const lessonCheckLibrary: Record<ConceptId, LessonCheckQuestion[]> = {
  vectors: [
    {
      id: 'vectors-check-1',
      conceptId: 'vectors',
      prompt: 'In a linear combination a v + b w, what are a and b?',
      choices: [
        { id: 'a', label: 'Scalars that weight the vectors' },
        { id: 'b', label: 'The coordinates of v only' },
        { id: 'c', label: 'Names for rows' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Right. Scalars are the weights in the combination.',
      incorrectFeedback: 'Look back at scalar: it stretches or weights a vector.',
    },
    {
      id: 'vectors-check-2',
      conceptId: 'vectors',
      prompt: 'How do you usually solve a vector equation in coordinates?',
      choices: [
        { id: 'a', label: 'Match each coordinate with a scalar equation' },
        { id: 'b', label: 'Ignore coordinate positions' },
        { id: 'c', label: 'Only count the number of vectors' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Yes. Coordinate equations expose the unknown weights.',
      incorrectFeedback: 'A vector equation becomes one equation per coordinate.',
    },
  ],
  span: [
    {
      id: 'span-check-1',
      conceptId: 'span',
      prompt: 'What does span measure?',
      choices: [
        { id: 'a', label: 'Everything reachable by linear combinations' },
        { id: 'b', label: 'Only the largest coordinate' },
        { id: 'c', label: 'The number of equations in a system' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Exactly. Span is the reachable set.',
      incorrectFeedback: 'Span is about what combinations can reach.',
    },
    {
      id: 'span-check-2',
      conceptId: 'span',
      prompt: 'If one vector is a multiple of another, what is the key issue?',
      choices: [
        { id: 'a', label: 'Redundancy' },
        { id: 'b', label: 'Orthogonality' },
        { id: 'c', label: 'A guaranteed inverse' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Right. Multiples repeat the same direction.',
      incorrectFeedback: 'A multiple repeats a direction instead of adding a new one.',
    },
  ],
  systems: [
    {
      id: 'systems-check-1',
      conceptId: 'systems',
      prompt: 'What must be true of a solution to a system?',
      choices: [
        { id: 'a', label: 'It satisfies every equation' },
        { id: 'b', label: 'It satisfies only the first equation' },
        { id: 'c', label: 'It must always be the zero vector' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. Every equation must be true at once.',
      incorrectFeedback: 'A system solution must satisfy all equations simultaneously.',
    },
    {
      id: 'systems-check-2',
      conceptId: 'systems',
      prompt: 'What does a contradiction like 0 = 5 mean?',
      choices: [
        { id: 'a', label: 'No solution' },
        { id: 'b', label: 'Exactly one solution' },
        { id: 'c', label: 'Every vector is a solution' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Yes. A contradiction means inconsistent.',
      incorrectFeedback: 'A false statement means the equations cannot all be true.',
    },
  ],
  'row-reduction': [
    {
      id: 'row-check-1',
      conceptId: 'row-reduction',
      prompt: 'Which is a legal row operation?',
      choices: [
        { id: 'a', label: 'Add a multiple of one row to another row' },
        { id: 'b', label: 'Change one column because it looks easier' },
        { id: 'c', label: 'Delete a variable' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. Row replacement is legal.',
      incorrectFeedback: 'Row reduction preserves solutions only through legal row operations.',
    },
    {
      id: 'row-check-2',
      conceptId: 'row-reduction',
      prompt: 'What does a pivot column identify?',
      choices: [
        { id: 'a', label: 'A forced variable or direction' },
        { id: 'b', label: 'An optional definition' },
        { id: 'c', label: 'A column you should erase' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Right. Pivots mark the forced structure.',
      incorrectFeedback: 'Pivots identify the anchored variables or directions.',
    },
  ],
  'matrix-transformations': [
    {
      id: 'matrix-check-1',
      conceptId: 'matrix-transformations',
      prompt: 'What is a matrix-vector product best understood as?',
      choices: [
        { id: 'a', label: 'A linear combination of matrix columns' },
        { id: 'b', label: 'A list of unrelated numbers' },
        { id: 'c', label: 'A way to ignore basis vectors' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Yes. The input coordinates weight the columns.',
      incorrectFeedback: 'Matrix-vector multiplication combines columns using input weights.',
    },
    {
      id: 'matrix-check-2',
      conceptId: 'matrix-transformations',
      prompt: 'If a matrix sends e1 to (1, 2), where does that vector appear?',
      choices: [
        { id: 'a', label: 'In the first column' },
        { id: 'b', label: 'In the determinant only' },
        { id: 'c', label: 'Nowhere in the matrix' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. Images of basis vectors are columns.',
      incorrectFeedback: 'The first column records where e1 goes.',
    },
  ],
  determinants: [
    {
      id: 'det-check-1',
      conceptId: 'determinants',
      prompt: 'What does determinant zero mean geometrically?',
      choices: [
        { id: 'a', label: 'The transformation collapses dimension' },
        { id: 'b', label: 'The matrix is always diagonal' },
        { id: 'c', label: 'Every vector gets longer' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Right. Zero determinant means space is flattened in some direction.',
      incorrectFeedback: 'Determinant zero means the transformation loses dimension.',
    },
    {
      id: 'det-check-2',
      conceptId: 'determinants',
      prompt: 'What is det([[a, b], [c, d]])?',
      choices: [
        { id: 'a', label: 'ad - bc' },
        { id: 'b', label: 'ab - cd' },
        { id: 'c', label: 'a + b + c + d' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. The 2 by 2 determinant is ad - bc.',
      incorrectFeedback: 'For a 2 by 2 matrix, multiply diagonals as ad - bc.',
    },
  ],
  inverses: [
    {
      id: 'inverse-check-1',
      conceptId: 'inverses',
      prompt: 'What does A inverse do to A?',
      choices: [
        { id: 'a', label: 'It undoes A and gives the identity' },
        { id: 'b', label: 'It deletes every row' },
        { id: 'c', label: 'It changes vectors into scalars only' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Yes. A inverse A = I.',
      incorrectFeedback: 'An inverse undoes the action of the original matrix.',
    },
    {
      id: 'inverse-check-2',
      conceptId: 'inverses',
      prompt: 'Which condition blocks invertibility?',
      choices: [
        { id: 'a', label: 'A missing pivot' },
        { id: 'b', label: 'Having square shape' },
        { id: 'c', label: 'Having nonzero determinant' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. A missing pivot means some information is lost.',
      incorrectFeedback: 'Invertible square matrices have pivots in every column.',
    },
  ],
  subspaces: [
    {
      id: 'subspace-check-1',
      conceptId: 'subspaces',
      prompt: 'What must every subspace contain?',
      choices: [
        { id: 'a', label: 'The zero vector' },
        { id: 'b', label: 'Only positive vectors' },
        { id: 'c', label: 'Exactly two vectors' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. Zero is required.',
      incorrectFeedback: 'The zero vector is a fast first test for subspaces.',
    },
    {
      id: 'subspace-check-2',
      conceptId: 'subspaces',
      prompt: 'What does a basis do?',
      choices: [
        { id: 'a', label: 'Spans a space without redundancy' },
        { id: 'b', label: 'Lists every vector in the space' },
        { id: 'c', label: 'Removes all dimensions' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Yes. Basis means spanning plus independent.',
      incorrectFeedback: 'A basis is an efficient, non-redundant spanning set.',
    },
  ],
  'fundamental-subspaces': [
    {
      id: 'four-subspaces-check-1',
      conceptId: 'fundamental-subspaces',
      prompt: 'Which space contains inputs x where Ax = 0?',
      choices: [
        { id: 'a', label: 'Null space' },
        { id: 'b', label: 'Column space' },
        { id: 'c', label: 'Output space only' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. The null space is made of zero-producing inputs.',
      incorrectFeedback: 'The null space answers which inputs are sent to zero.',
    },
    {
      id: 'four-subspaces-check-2',
      conceptId: 'fundamental-subspaces',
      prompt: 'Where does the column space live?',
      choices: [
        { id: 'a', label: 'In the output space' },
        { id: 'b', label: 'Only inside the input variables' },
        { id: 'c', label: 'Outside the matrix equation' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Right. Ax is an output, so column space lives in output space.',
      incorrectFeedback: 'Column space is the set of outputs reachable as Ax.',
    },
  ],
  'rank-nullity': [
    {
      id: 'rank-nullity-check-1',
      conceptId: 'rank-nullity',
      prompt: 'In rank(A) + nullity(A) = n, what is n?',
      choices: [
        { id: 'a', label: 'The number of columns' },
        { id: 'b', label: 'The number of nonzero rows only' },
        { id: 'c', label: 'The determinant' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. n is the input dimension.',
      incorrectFeedback: 'Rank-nullity splits the input columns into pivots and freedom.',
    },
    {
      id: 'rank-nullity-check-2',
      conceptId: 'rank-nullity',
      prompt: 'What does nullity count?',
      choices: [
        { id: 'a', label: 'Free directions in the null space' },
        { id: 'b', label: 'Only the entries equal to zero' },
        { id: 'c', label: 'The number of rows' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Yes. Nullity is the dimension of the null space.',
      incorrectFeedback: 'Nullity counts free variables or zero-producing directions.',
    },
  ],
  orthogonality: [
    {
      id: 'orth-check-1',
      conceptId: 'orthogonality',
      prompt: 'How do you test whether two vectors are orthogonal?',
      choices: [
        { id: 'a', label: 'Compute their dot product' },
        { id: 'b', label: 'Count their coordinates' },
        { id: 'c', label: 'Check whether they have the same length only' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Right. Dot product zero means orthogonal.',
      incorrectFeedback: 'Orthogonality is measured by the dot product.',
    },
    {
      id: 'orth-check-2',
      conceptId: 'orthogonality',
      prompt: 'What does projection measure?',
      choices: [
        { id: 'a', label: 'How much of one vector lies in a direction' },
        { id: 'b', label: 'Whether a vector has no coordinates' },
        { id: 'c', label: 'Only whether two vectors are equal' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. Projection finds the component in a direction.',
      incorrectFeedback: 'Projection asks for the closest component in a direction.',
    },
  ],
  'least-squares': [
    {
      id: 'least-squares-check-1',
      conceptId: 'least-squares',
      prompt: 'What is the residual in Ax approximately equals b?',
      choices: [
        { id: 'a', label: 'b - Ax' },
        { id: 'b', label: 'A + b' },
        { id: 'c', label: 'Only x' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. The residual is the error vector.',
      incorrectFeedback: 'Residual means the part of b not explained by Ax.',
    },
    {
      id: 'least-squares-check-2',
      conceptId: 'least-squares',
      prompt: 'At the best least-squares fit, the residual is orthogonal to what?',
      choices: [
        { id: 'a', label: 'The column space of A' },
        { id: 'b', label: 'Every possible matrix' },
        { id: 'c', label: 'Only the zero vector' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Right. That orthogonality gives the normal equations.',
      incorrectFeedback: 'The best-fit error is perpendicular to the reachable outputs.',
    },
  ],
  eigenvalues: [
    {
      id: 'eigen-check-1',
      conceptId: 'eigenvalues',
      prompt: 'In Av = lambda v, what is lambda?',
      choices: [
        { id: 'a', label: 'The eigenvalue' },
        { id: 'b', label: 'The zero vector' },
        { id: 'c', label: 'The number of columns' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Yes. Lambda is the scaling factor.',
      incorrectFeedback: 'The eigenvalue is the scalar multiplying v.',
    },
    {
      id: 'eigen-check-2',
      conceptId: 'eigenvalues',
      prompt: 'What is special about an eigenvector direction?',
      choices: [
        { id: 'a', label: 'The matrix only scales it' },
        { id: 'b', label: 'It must be the zero vector' },
        { id: 'c', label: 'It is always unchanged' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. It stays on its line, though it may scale or flip.',
      incorrectFeedback: 'Eigenvectors stay on their line, but they can stretch or flip.',
    },
  ],
  'change-of-basis': [
    {
      id: 'basis-change-check-1',
      conceptId: 'change-of-basis',
      prompt: 'What are coordinates relative to a basis?',
      choices: [
        { id: 'a', label: 'Weights on the basis vectors' },
        { id: 'b', label: 'A new vector unrelated to the old one' },
        { id: 'c', label: 'Only the determinant' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. Coordinates are basis weights.',
      incorrectFeedback: 'Coordinates describe how to build the vector from a basis.',
    },
    {
      id: 'basis-change-check-2',
      conceptId: 'change-of-basis',
      prompt: 'If P has basis vectors as columns, what does P[x]_B give?',
      choices: [
        { id: 'a', label: 'The vector in standard coordinates' },
        { id: 'b', label: 'Only the trace' },
        { id: 'c', label: 'The nullity automatically' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Right. P converts basis coordinates to standard coordinates.',
      incorrectFeedback: 'The columns of P are the basis vectors used to rebuild x.',
    },
  ],
  diagonalization: [
    {
      id: 'diagonalization-check-1',
      conceptId: 'diagonalization',
      prompt: 'What do columns of P contain in A = P D P inverse?',
      choices: [
        { id: 'a', label: 'Eigenvectors' },
        { id: 'b', label: 'Residuals' },
        { id: 'c', label: 'Only row operations' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. P is built from an eigenbasis.',
      incorrectFeedback: 'Diagonalization uses eigenvectors as a basis.',
    },
    {
      id: 'diagonalization-check-2',
      conceptId: 'diagonalization',
      prompt: 'Why is a diagonal matrix easy to power?',
      choices: [
        { id: 'a', label: 'You power each diagonal entry' },
        { id: 'b', label: 'All entries become zero' },
        { id: 'c', label: 'It has no eigenvalues' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Yes. Diagonal action is coordinate-by-coordinate scaling.',
      incorrectFeedback: 'Diagonal matrices act independently on each coordinate.',
    },
  ],
  'proof-techniques': [
    {
      id: 'proof-check-1',
      conceptId: 'proof-techniques',
      prompt: 'To prove a set is a subspace, what must you usually show?',
      choices: [
        { id: 'a', label: 'Zero, closure under addition, and closure under scaling' },
        { id: 'b', label: 'Only that it has two vectors' },
        { id: 'c', label: 'Only that it has a determinant' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Correct. Those are the core subspace checks.',
      incorrectFeedback: 'Subspace proofs usually turn on zero and closure.',
    },
    {
      id: 'proof-check-2',
      conceptId: 'proof-techniques',
      prompt: 'What does one counterexample do to a universal claim?',
      choices: [
        { id: 'a', label: 'Disproves it' },
        { id: 'b', label: 'Proves it forever' },
        { id: 'c', label: 'Has no effect' },
      ],
      correctChoiceId: 'a',
      correctFeedback: 'Right. One valid counterexample is enough.',
      incorrectFeedback: 'A universal claim fails when one valid example breaks it.',
    },
  ],
}

const commonMistakes = {
  sign: {
    id: 'sign-slip',
    label: 'Sign or arithmetic slip',
    triggers: ['-2', 'negative', 'subtract wrong', 'sign'],
    feedback: 'Your setup may be right, but a sign or arithmetic step is drifting.',
    repair: 'Recompute one scalar equation slowly and write each operation on its own line.',
  },
  coordinate: {
    id: 'coordinate-mixup',
    label: 'Coordinate mix-up',
    triggers: ['swap', 'row', 'column', 'x y', 'y x'],
    feedback: 'This looks like a coordinate or row-column mix-up.',
    repair: 'Name what each coordinate represents before calculating.',
  },
  spanCount: {
    id: 'span-counting',
    label: 'Counting vectors instead of directions',
    triggers: ['two vectors so yes', 'three vectors', 'enough vectors', 'number of vectors'],
    feedback: 'Span is about independent directions, not just how many vectors you have.',
    repair: 'Check whether one vector is a scalar multiple or combination of the others.',
  },
  rowOperation: {
    id: 'invalid-row-operation',
    label: 'Invalid row operation',
    triggers: ['column operation', 'changed a column', 'multiply column', 'add columns'],
    feedback: 'That operation changes the problem. Row reduction only allows row operations.',
    repair: 'Use row swap, row scaling, or row replacement only.',
  },
  eigenScale: {
    id: 'eigen-unchanged',
    label: 'Eigenvectors are scaled, not frozen',
    triggers: ['unchanged', 'same vector', 'does not move'],
    feedback: 'An eigenvector can stretch, shrink, or flip. It only stays on its line.',
    repair: 'Use Av = lambda v and ask whether the output is a scalar multiple of v.',
  },
  setupMismatch: {
    id: 'setup-mismatch',
    label: 'Setup does not match the goal',
    triggers: ['guess', 'skip setup', 'not sure', 'random'],
    feedback: 'This step is not yet tied to the definition, equation, or test the problem needs.',
    repair: 'Restate what the problem asks for, then write the first matching equation or definition.',
  },
} satisfies Record<string, MistakePattern>

export const problemBank: Problem[] = [
  {
    id: 'vec-1',
    conceptId: 'vectors',
    prompt: 'Find a and b so that a(1, 2) + b(3, 1) = (7, 8).',
    answerType: 'vector',
    accepted: ['a=17/5,b=6/5', '17/5,6/5', 'a = 3.4, b = 1.2'],
    expectedAnswer: { kind: 'vector', labels: ['a', 'b'], values: [17 / 5, 6 / 5] },
    hint: 'Turn the vector equation into x- and y-coordinate equations.',
    deeperHint: 'Solve a + 3b = 7 and 2a + b = 8.',
    solutionSteps: [
      'Use coordinates: a + 3b = 7 and 2a + b = 8.',
      'From the second equation, b = 8 - 2a.',
      'Substitute: a + 3(8 - 2a) = 7.',
      'So -5a = -17, a = 17/5, and b = 6/5.',
    ],
    checksFor: 'Translates a linear combination into scalar equations.',
    mistakePatterns: [commonMistakes.sign, commonMistakes.coordinate],
    difficulty: 1,
  },
  {
    id: 'vec-2',
    conceptId: 'vectors',
    prompt: 'Write (4, -2, 5) using the standard basis e1, e2, e3.',
    answerType: 'explanation',
    accepted: ['4e1-2e2+5e3', '4 e1 - 2 e2 + 5 e3', '4, -2, 5'],
    expectedAnswer: { kind: 'vector', values: [4, -2, 5] },
    mustInclude: ['4', '-2', '5'],
    hint: 'Each standard basis vector carries one coordinate.',
    deeperHint: 'e1 contributes the first coordinate, e2 the second, e3 the third.',
    solutionSteps: ['(4, -2, 5) = 4e1 - 2e2 + 5e3.'],
    checksFor: 'Understands coordinates as basis weights.',
    mistakePatterns: [commonMistakes.coordinate],
    difficulty: 1,
  },
  {
    id: 'span-1',
    conceptId: 'span',
    prompt: 'Do (2, 4), (1, 2), and (3, 6) span all of R2? Explain.',
    answerType: 'explanation',
    accepted: ['no', 'not all', 'line', 'multiples', 'same direction'],
    mustInclude: ['no'],
    hint: 'Check whether all three vectors point in the same direction.',
    deeperHint: 'Each vector is a multiple of (1, 2).',
    solutionSteps: [
      '(2, 4) = 2(1, 2) and (3, 6) = 3(1, 2).',
      'All combinations stay on one line.',
      'They span a line, not all of R2.',
    ],
    checksFor: 'Distinguishes number of vectors from number of directions.',
    mistakePatterns: [commonMistakes.spanCount],
    difficulty: 1,
  },
  {
    id: 'span-2',
    conceptId: 'span',
    prompt: 'Are (1, 0, 1), (0, 1, 1), and (1, 1, 2) independent?',
    answerType: 'explanation',
    accepted: ['no', 'dependent', 'sum', 'third is sum'],
    mustInclude: ['dependent'],
    hint: 'Compare the third vector with the first two.',
    deeperHint: '(1, 0, 1) + (0, 1, 1) = (1, 1, 2).',
    solutionSteps: [
      'The third vector equals the sum of the first two.',
      'That gives a nontrivial dependence relation.',
      'So the vectors are linearly dependent.',
    ],
    checksFor: 'Finds redundancy through a dependence relation.',
    mistakePatterns: [commonMistakes.spanCount],
    difficulty: 2,
  },
  {
    id: 'sys-1',
    conceptId: 'systems',
    prompt: 'Solve x + y = 6 and x - y = 2.',
    answerType: 'vector',
    accepted: ['x=4,y=2', '4,2', '(4,2)', 'x = 4 and y = 2'],
    expectedAnswer: { kind: 'vector', labels: ['x', 'y'], values: [4, 2] },
    mustInclude: ['4', '2'],
    hint: 'Add the equations to eliminate y.',
    deeperHint: 'Adding gives 2x = 8.',
    solutionSteps: ['Add equations: 2x = 8.', 'x = 4.', 'Substitute: 4 + y = 6, so y = 2.'],
    checksFor: 'Solves a two-equation system and checks both equations.',
    mistakePatterns: [commonMistakes.sign],
    difficulty: 1,
  },
  {
    id: 'sys-2',
    conceptId: 'systems',
    prompt: 'x + 2y = 3 and 2x + 4y = 8. How many solutions?',
    answerType: 'choice',
    accepted: ['none', 'no solution', 'inconsistent'],
    mustInclude: ['no'],
    hint: 'Compare the second left side to twice the first left side.',
    deeperHint: 'Twice the first equation would have right side 6, not 8.',
    solutionSteps: [
      'The left side of the second equation is twice the first.',
      'But the right side is 8 instead of 6.',
      'The equations contradict each other, so there is no solution.',
    ],
    checksFor: 'Recognizes inconsistency without over-solving.',
    mistakePatterns: [commonMistakes.sign],
    difficulty: 2,
  },
  {
    id: 'row-1',
    conceptId: 'row-reduction',
    prompt: 'In RREF, what does a column without a pivot mean for that variable?',
    answerType: 'explanation',
    accepted: ['free variable', 'free', 'parameter'],
    mustInclude: ['free'],
    hint: 'A pivot variable is forced by an equation.',
    deeperHint: 'A non-pivot variable can be chosen freely.',
    solutionSteps: ['A column without a pivot corresponds to a free variable.'],
    checksFor: 'Connects pivots to free variables.',
    mistakePatterns: [commonMistakes.rowOperation],
    difficulty: 1,
  },
  {
    id: 'row-2',
    conceptId: 'row-reduction',
    prompt: 'Row reduce [[1, 2, 5], [0, 1, 1]]. What are x and y?',
    answerType: 'vector',
    accepted: ['x=3,y=1', '3,1', '(3,1)', 'x = 3 and y = 1'],
    expectedAnswer: { kind: 'vector', labels: ['x', 'y'], values: [3, 1] },
    mustInclude: ['3', '1'],
    hint: 'Use the second row to clear the 2 above the y pivot.',
    deeperHint: 'R1 <- R1 - 2R2.',
    solutionSteps: [
      'R2 says y = 1.',
      'R1 is x + 2y = 5.',
      'Substitute y = 1: x + 2 = 5, so x = 3.',
    ],
    checksFor: 'Reads a row-reduced system correctly.',
    mistakePatterns: [commonMistakes.rowOperation, commonMistakes.sign],
    difficulty: 2,
  },
  {
    id: 'mat-1',
    conceptId: 'matrix-transformations',
    prompt: 'What does [[2, 0], [0, 3]] do to (x, y)?',
    answerType: 'explanation',
    accepted: ['(2x,3y)', '2x,3y', 'stretches x by 2 and y by 3'],
    mustInclude: ['2', '3'],
    hint: 'Multiply the matrix by the vector (x, y).',
    deeperHint: 'The first coordinate becomes 2x; the second becomes 3y.',
    solutionSteps: ['[[2, 0], [0, 3]](x, y) = (2x, 3y).'],
    checksFor: 'Interprets a diagonal matrix as coordinate scaling.',
    mistakePatterns: [commonMistakes.coordinate],
    difficulty: 1,
  },
  {
    id: 'mat-2',
    conceptId: 'matrix-transformations',
    prompt: 'Find the matrix that sends e1 to (1, 2) and e2 to (3, 4).',
    answerType: 'explanation',
    accepted: ['[[1,3],[2,4]]', '1 3 2 4', 'columns are (1,2) and (3,4)'],
    expectedAnswer: {
      kind: 'matrix',
      values: [
        [1, 3],
        [2, 4],
      ],
    },
    mustInclude: ['1', '2', '3', '4'],
    hint: 'Images of basis vectors become columns.',
    deeperHint: 'The first column is T(e1); the second column is T(e2).',
    solutionSteps: ['Put T(e1) in column 1 and T(e2) in column 2.', 'The matrix is [[1, 3], [2, 4]].'],
    checksFor: 'Uses columns as images of basis vectors.',
    mistakePatterns: [commonMistakes.coordinate],
    difficulty: 2,
  },
  {
    id: 'sub-1',
    conceptId: 'subspaces',
    prompt: 'Is {(x, y): x + y = 1} a subspace of R2?',
    answerType: 'explanation',
    accepted: ['no', 'not a subspace', 'zero vector', 'does not contain zero'],
    mustInclude: ['no'],
    hint: 'Start with the zero vector.',
    deeperHint: '(0, 0) gives 0 + 0 = 0, not 1.',
    solutionSteps: ['Every subspace must contain the zero vector.', '(0, 0) is not in this set.', 'So it is not a subspace.'],
    checksFor: 'Uses zero vector as a fast subspace test.',
    mistakePatterns: [commonMistakes.spanCount],
    difficulty: 1,
  },
  {
    id: 'sub-2',
    conceptId: 'subspaces',
    prompt: 'Give a basis for span{(1, 2), (2, 4), (0, 1)}.',
    answerType: 'explanation',
    accepted: ['(1,2),(0,1)', '(0,1),(1,2)', 'remove (2,4)', 'basis is (1,2) and (0,1)'],
    mustInclude: ['1', '2', '0'],
    hint: 'Remove the vector that repeats an existing direction.',
    deeperHint: '(2, 4) = 2(1, 2).',
    solutionSteps: ['(2, 4) is redundant.', '(1, 2) and (0, 1) are independent.', 'One basis is {(1, 2), (0, 1)}.'],
    checksFor: 'Removes redundancy while preserving span.',
    mistakePatterns: [commonMistakes.spanCount],
    difficulty: 2,
  },
  {
    id: 'orth-1',
    conceptId: 'orthogonality',
    prompt: 'Are (2, -1, 3) and (1, 2, 0) orthogonal?',
    answerType: 'choice',
    accepted: ['yes', 'orthogonal', 'dot product is 0', '0'],
    expectedAnswer: { kind: 'number', value: 0 },
    mustInclude: ['0'],
    hint: 'Compute the dot product.',
    deeperHint: '2(1) + (-1)(2) + 3(0).',
    solutionSteps: ['2(1) + (-1)(2) + 3(0) = 2 - 2 + 0 = 0.', 'Dot product 0 means orthogonal.'],
    checksFor: 'Uses dot product for perpendicularity.',
    mistakePatterns: [commonMistakes.sign],
    difficulty: 1,
  },
  {
    id: 'orth-2',
    conceptId: 'orthogonality',
    prompt: 'Project (2, 3) onto the span of (1, 1).',
    answerType: 'vector',
    accepted: ['(5/2,5/2)', '5/2,5/2', '2.5,2.5'],
    expectedAnswer: { kind: 'vector', values: [5 / 2, 5 / 2] },
    mustInclude: ['5'],
    hint: 'Use (v dot u)/(u dot u) times u.',
    deeperHint: 'v dot u = 5 and u dot u = 2.',
    solutionSteps: ['Projection = (5/2)(1, 1).', 'So the projection is (5/2, 5/2).'],
    checksFor: 'Applies projection formula and interprets closest vector.',
    mistakePatterns: [commonMistakes.coordinate, commonMistakes.sign],
    difficulty: 2,
  },
  {
    id: 'eig-1',
    conceptId: 'eigenvalues',
    prompt: 'If Av = 5v for nonzero v, what is the eigenvalue?',
    answerType: 'number',
    accepted: ['5', 'lambda=5', 'eigenvalue is 5'],
    expectedAnswer: { kind: 'number', value: 5 },
    mustInclude: ['5'],
    hint: 'Compare Av = 5v with Av = lambda v.',
    deeperHint: 'lambda is the scalar multiplying v.',
    solutionSteps: ['In Av = lambda v, the scalar lambda is the eigenvalue.', 'Here lambda = 5.'],
    checksFor: 'Recognizes eigenvalue notation.',
    mistakePatterns: [commonMistakes.eigenScale],
    difficulty: 1,
  },
  {
    id: 'eig-2',
    conceptId: 'eigenvalues',
    prompt: 'Does an eigenvector have to be nonzero? Explain why.',
    answerType: 'explanation',
    accepted: ['yes', 'nonzero', 'zero vector would work for every lambda', 'zero works for every lambda'],
    mustInclude: ['nonzero'],
    hint: 'Ask what happens if v = 0.',
    deeperHint: 'A0 = lambda 0 is true for every lambda.',
    solutionSteps: ['The zero vector satisfies A0 = lambda 0 for every lambda.', 'That would make every scalar look like an eigenvalue.', 'So eigenvectors must be nonzero.'],
    checksFor: 'Understands the nonzero condition.',
    mistakePatterns: [commonMistakes.eigenScale],
    difficulty: 2,
  },
  {
    id: 'det-1',
    conceptId: 'determinants',
    prompt: 'Compute det([[3, 2], [1, 4]]).',
    answerType: 'number',
    accepted: ['10', 'det=10', 'determinant is 10'],
    expectedAnswer: { kind: 'number', value: 10 },
    mustInclude: ['10'],
    hint: 'For [[a, b], [c, d]], use ad - bc.',
    deeperHint: 'Compute 3(4) - 2(1).',
    solutionSteps: ['Use ad - bc.', '3(4) - 2(1) = 12 - 2.', 'The determinant is 10.'],
    checksFor: 'Computes a 2 by 2 determinant and interprets nonzero scaling.',
    mistakePatterns: [commonMistakes.sign],
    difficulty: 1,
  },
  {
    id: 'inv-1',
    conceptId: 'inverses',
    prompt: 'If det(A) = 0 for a square matrix A, is A invertible?',
    answerType: 'choice',
    accepted: ['no', 'not invertible', 'singular'],
    mustInclude: ['no'],
    hint: 'Invertibility requires no collapsed directions.',
    deeperHint: 'A zero determinant means the transformation loses dimension.',
    solutionSteps: ['det(A) = 0 means A is singular.', 'A singular matrix has no inverse.', 'So A is not invertible.'],
    checksFor: 'Connects determinant zero to non-invertibility.',
    mistakePatterns: [commonMistakes.spanCount],
    difficulty: 1,
  },
  {
    id: 'four-sub-1',
    conceptId: 'fundamental-subspaces',
    prompt: 'For A = [[1, 0], [0, 0]], describe the null space.',
    answerType: 'explanation',
    accepted: ['x1=0', 'span of (0,1)', '(0,1)', 'multiples of (0,1)'],
    mustInclude: ['0', '1'],
    hint: 'Solve Ax = 0.',
    deeperHint: 'The equation is x1 = 0, while x2 is free.',
    solutionSteps: ['Ax = 0 gives x1 = 0.', 'x2 is free.', 'The null space is span{(0, 1)}.'],
    checksFor: 'Finds a null space from a simple matrix equation.',
    mistakePatterns: [commonMistakes.coordinate],
    difficulty: 2,
  },
  {
    id: 'rank-nullity-1',
    conceptId: 'rank-nullity',
    prompt: 'A 4 by 7 matrix has rank 5. What is its nullity?',
    answerType: 'number',
    accepted: ['2', 'nullity=2', 'nullity is 2'],
    expectedAnswer: { kind: 'number', value: 2 },
    mustInclude: ['2'],
    hint: 'Use rank + nullity = number of columns.',
    deeperHint: '5 + nullity = 7.',
    solutionSteps: ['The matrix has 7 columns.', 'Use rank + nullity = 7.', '5 + nullity = 7, so nullity = 2.'],
    checksFor: 'Uses rank-nullity with the input dimension.',
    mistakePatterns: [commonMistakes.coordinate],
    difficulty: 1,
  },
  {
    id: 'least-squares-1',
    conceptId: 'least-squares',
    prompt: 'In least squares, what condition does the residual r = b - Ax satisfy?',
    answerType: 'explanation',
    accepted: ['orthogonal to column space', 'perpendicular to column space', 'A^T r = 0', 'At r = 0'],
    hint: 'At the best fit, the error cannot point along a column direction.',
    deeperHint: 'The residual is perpendicular to every column of A.',
    solutionSteps: ['The best approximation projects b onto Col(A).', 'The residual points from the projection to b.', 'That residual is orthogonal to Col(A), so A^T r = 0.'],
    checksFor: 'Connects least squares to orthogonal projection.',
    mistakePatterns: [commonMistakes.coordinate],
    difficulty: 2,
  },
  {
    id: 'basis-change-1',
    conceptId: 'change-of-basis',
    prompt: 'For basis B = {(2, 0), (0, 3)}, find the B-coordinates of (6, 12).',
    answerType: 'vector',
    accepted: ['(3,4)', '3,4', '[3,4]', '3 and 4'],
    expectedAnswer: { kind: 'vector', values: [3, 4] },
    mustInclude: ['3', '4'],
    hint: 'Find weights a and b so a(2,0) + b(0,3) = (6,12).',
    deeperHint: 'Solve 2a = 6 and 3b = 12.',
    solutionSteps: ['Set a(2, 0) + b(0, 3) = (6, 12).', '2a = 6, so a = 3.', '3b = 12, so b = 4. The B-coordinates are (3, 4).'],
    checksFor: 'Interprets coordinates as weights in a chosen basis.',
    mistakePatterns: [commonMistakes.coordinate],
    difficulty: 1,
  },
  {
    id: 'diag-1',
    conceptId: 'diagonalization',
    prompt: 'If A = P D P inverse, what is A^3?',
    answerType: 'explanation',
    accepted: ['P D^3 P inverse', 'PD^3P inverse', 'P D cubed P inverse'],
    mustInclude: ['p', 'd', '3'],
    hint: 'Multiply A by itself and cancel the middle P inverse P pairs.',
    deeperHint: 'A^2 = P D^2 P inverse, so continue once more.',
    solutionSteps: ['A^3 = (P D P inverse)(P D P inverse)(P D P inverse).', 'Each P inverse P becomes I.', 'So A^3 = P D^3 P inverse.'],
    checksFor: 'Uses diagonalization to simplify matrix powers.',
    mistakePatterns: [commonMistakes.coordinate],
    difficulty: 2,
  },
  {
    id: 'proof-1',
    conceptId: 'proof-techniques',
    prompt: 'To prove a set W is a subspace, which three checks should you usually show?',
    answerType: 'explanation',
    accepted: ['zero, closed under addition, closed under scalar multiplication', 'contains zero and closed under addition and scalar multiplication', 'zero vector closure addition scalar'],
    mustInclude: ['zero', 'addition', 'scalar'],
    hint: 'Start with the subspace definition.',
    deeperHint: 'You need zero plus two closure properties.',
    solutionSteps: ['Show the zero vector is in W.', 'Show if u and v are in W, then u + v is in W.', 'Show if c is a scalar and u is in W, then cu is in W.'],
    checksFor: 'Uses definitions to structure a proof.',
    mistakePatterns: [commonMistakes.spanCount],
    difficulty: 1,
  },
]

const byConcept = (conceptId: ConceptId) =>
  problemBank.filter((problem) => problem.conceptId === conceptId)

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replaceAll('λ', 'lambda')
    .replaceAll('−', '-')
    .replace(/[^a-z0-9/.,=+\-() ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const compact = (value: string) => normalize(value).replace(/\s/g, '')

const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`

const nowIso = () => new Date().toISOString()

export const getConcept = (conceptId: ConceptId) =>
  concepts.find((concept) => concept.id === conceptId) ?? concepts[0]

export const getLesson = (conceptId: ConceptId) =>
  lessonLibrary[conceptId] ?? lessonLibrary.vectors

export const getLessonChecks = (conceptId: ConceptId) =>
  lessonCheckLibrary[conceptId] ?? lessonCheckLibrary.vectors

export const getProblem = (problemId: string) =>
  problemBank.find((problem) => problem.id === problemId) ?? problemBank[0]

export const conceptSequenceFrom = (conceptId: ConceptId) => {
  const startIndex = Math.max(
    0,
    concepts.findIndex((concept) => concept.id === conceptId),
  )
  return concepts.slice(startIndex)
}

export const getPrerequisiteStatus = (
  profile: LearnerProfile,
  conceptId: ConceptId,
): PrerequisiteStatus[] =>
  prerequisiteGraph[conceptId].map((prereqId) => {
    const concept = getConcept(prereqId)
    const mastery = profile.mastery[prereqId] ?? 0
    const lessonComplete = Boolean(profile.lessonReads?.[prereqId])
    return {
      conceptId: prereqId,
      title: concept.shortTitle,
      mastery,
      lessonComplete,
      ready: mastery >= 60 && lessonComplete,
    }
  })

export const evaluateLessonChecks = (
  conceptId: ConceptId,
  responses: Record<string, string>,
) => {
  const checks = getLessonChecks(conceptId)
  const results = checks.map((check) => ({
    check,
    selectedChoiceId: responses[check.id] ?? '',
    correct: responses[check.id] === check.correctChoiceId,
  }))
  return {
    results,
    answered: results.filter((result) => result.selectedChoiceId).length,
    total: checks.length,
    passed:
      results.length > 0 &&
      results.every((result) => result.selectedChoiceId && result.correct),
  }
}

export const evaluateDiagnostic = (
  responses: Record<string, string>,
): DiagnosticReport => {
  const completedAt = nowIso()
  const strengths = diagnosticQuestions
    .filter((question) => responses[question.id] === question.correctChoiceId)
    .map((question) => question.conceptId)
  const repairs = diagnosticQuestions
    .filter((question) => responses[question.id] !== question.correctChoiceId)
    .map((question) => question.repairIfMissed)
  const firstRepair = diagnosticQuestions.find(
    (question) => responses[question.id] !== question.correctChoiceId,
  )
  return {
    completedAt,
    score: strengths.length,
    total: diagnosticQuestions.length,
    recommendedStart: firstRepair?.repairIfMissed ?? 'diagonalization',
    strengths,
    repairs,
    responses,
  }
}

export const evaluateResponse = (problem: Problem, response: string): LiveFeedback => {
  const normalized = normalize(response)
  const compacted = compact(response)

  if (!normalized) {
    return {
      tone: 'idle',
      headline: 'Ready when you are',
      detail: 'Start with what you notice. A partial setup is useful evidence.',
      nextAction: problem.hint,
      score: 0,
      matchedAccepted: false,
    }
  }

  const matchedMistake = problem.mistakePatterns.find((mistake) =>
    mistake.triggers.some((trigger) => normalized.includes(normalize(trigger))),
  )
  const mathEvaluation = problem.expectedAnswer
    ? evaluateMathAnswer(response, problem.expectedAnswer)
    : undefined
  const acceptedTextMatch = problem.accepted.some((accepted) => {
    const normalizedAccepted = normalize(accepted)
    return (
      normalized.includes(normalizedAccepted) ||
      compacted.includes(compact(accepted)) ||
      compact(accepted).includes(compacted)
    )
  })
  const hasMustIncludeTokens = Boolean(problem.mustInclude?.length)
  const mustIncludeMatch =
    !hasMustIncludeTokens ||
    (problem.mustInclude?.every((token) => compacted.includes(compact(token))) ?? true)
  const acceptedMatch =
    mathEvaluation?.status === 'correct' || (acceptedTextMatch && mustIncludeMatch)

  if (acceptedMatch) {
    return {
      tone: 'correct',
      headline: 'That matches the target idea',
      detail:
        mathEvaluation?.status === 'correct'
          ? `${problem.checksFor} ${mathEvaluation.detail}`
          : problem.checksFor,
      nextAction: 'Submit this, then move to the next problem.',
      score: 5,
      matchedAccepted: true,
    }
  }

  if (matchedMistake) {
    return {
      tone: 'mistake',
      headline: matchedMistake.label,
      detail: matchedMistake.feedback,
      nextAction: matchedMistake.repair,
      score: 2,
      mistake: matchedMistake,
      matchedAccepted: false,
    }
  }

  if (
    mathEvaluation?.status === 'partial' ||
    normalized.length > 18 ||
    (hasMustIncludeTokens && mustIncludeMatch)
  ) {
    return {
      tone: 'working',
      headline: 'Part of this is useful',
      detail:
        mathEvaluation?.status === 'partial'
          ? mathEvaluation.detail
          : 'I can see relevant structure, but the answer is not complete yet.',
      nextAction: problem.deeperHint,
      score: 3,
      matchedAccepted: false,
    }
  }

  return {
    tone: 'working',
    headline: 'Keep shaping it',
    detail: 'The response is still missing the key evidence for this problem.',
    nextAction: problem.hint,
    score: 1,
    matchedAccepted: false,
  }
}

export const getWorkStepTargets = (problem: Problem) =>
  problem.solutionSteps.length ? problem.solutionSteps : [problem.deeperHint]

const stopWords = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'gives',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'so',
  'the',
  'then',
  'to',
  'use',
  'with',
])

const meaningfulTokens = (value: string) =>
  normalize(value)
    .split(/[^a-z0-9/.-]+/)
    .filter((token) => token.length > 1 && !stopWords.has(token))

const misconceptionFromTriggers = (problem: Problem, value: string) => {
  const normalizedValue = normalize(value)
  return problem.mistakePatterns.find((mistake) =>
    mistake.triggers.some((trigger) => normalizedValue.includes(normalize(trigger))),
  )
}

const classifyWorkStepMisconception = (
  problem: Problem,
  response: string,
  expected: string,
) => {
  const normalizedResponse = normalize(response)
  const normalizedExpected = normalize(expected)
  const triggerMatch = misconceptionFromTriggers(problem, response)

  if (triggerMatch) return triggerMatch

  if (
    normalizedExpected.includes('add') &&
    (normalizedResponse.includes('subtract') || normalizedResponse.includes('minus'))
  ) {
    return commonMistakes.sign
  }

  if (
    normalizedExpected.includes('coordinate') &&
    (normalizedResponse.includes('row') || normalizedResponse.includes('column'))
  ) {
    return commonMistakes.coordinate
  }

  if (
    problem.conceptId === 'row-reduction' &&
    (normalizedResponse.includes('column operation') ||
      normalizedResponse.includes('add columns') ||
      normalizedResponse.includes('multiply column'))
  ) {
    return commonMistakes.rowOperation
  }

  if (
    ['span', 'subspaces', 'fundamental-subspaces'].includes(problem.conceptId) &&
    (normalizedResponse.includes('number of vectors') ||
      normalizedResponse.includes('enough vectors') ||
      normalizedResponse.includes('too many vectors'))
  ) {
    return commonMistakes.spanCount
  }

  if (
    problem.conceptId === 'eigenvalues' &&
    (normalizedResponse.includes('unchanged') ||
      normalizedResponse.includes('same vector') ||
      normalizedResponse.includes('does not move'))
  ) {
    return commonMistakes.eigenScale
  }

  return commonMistakes.setupMismatch
}

const evaluateWorkStep = (
  problem: Problem,
  response: string,
  expected: string,
  index: number,
): WorkStepFeedback => {
  const normalizedResponse = normalize(response)

  if (!normalizedResponse) {
    return {
      index,
      response,
      expected,
      status: 'empty',
      detail: `Step ${index + 1} is waiting for evidence.`,
      nextAction: expected,
    }
  }

  const responseCompact = compact(response)
  const expectedCompact = compact(expected)
  const responseTokens = new Set(meaningfulTokens(response))
  const expectedTokens = meaningfulTokens(expected)
  const overlap = expectedTokens.filter((token) => responseTokens.has(token)).length
  const requiredOverlap = Math.min(
    3,
    Math.max(1, Math.ceil(Math.max(expectedTokens.length, 1) * 0.35)),
  )
  const compactMatch =
    responseCompact.length >= 4 &&
    (expectedCompact.includes(responseCompact) || responseCompact.includes(expectedCompact))

  if (compactMatch || overlap >= requiredOverlap) {
    return {
      index,
      response,
      expected,
      status: 'on-track',
      detail: `Step ${index + 1} lines up with the solution path.`,
      nextAction:
        index === getWorkStepTargets(problem).length - 1
          ? 'Use this work to write the final answer.'
          : getWorkStepTargets(problem)[index + 1],
    }
  }

  const misconception = classifyWorkStepMisconception(problem, response, expected)

  return {
    index,
    response,
    expected,
    status: 'needs-work',
    detail: `${misconception.label}: ${misconception.feedback}`,
    nextAction: misconception.repair,
    misconception,
  }
}

export const evaluateWorkSteps = (
  problem: Problem,
  workSteps: string[] = [],
): WorkStepReport => {
  const targets = getWorkStepTargets(problem)
  const feedback = targets.map((target, index) =>
    evaluateWorkStep(problem, workSteps[index] ?? '', target, index),
  )
  const answered = feedback.filter((step) => step.response.trim()).length
  const onTrack = feedback.filter((step) => step.status === 'on-track').length
  const firstNeedsWork = feedback.find((step) => step.status === 'needs-work')
  const firstEmpty = feedback.find((step) => step.status === 'empty')
  const firstMisconception = feedback.find((step) => step.misconception)
  const misconception = firstMisconception?.misconception
    ? {
        pattern: firstMisconception.misconception,
        stepIndex: firstMisconception.index,
        evidence: firstMisconception.response,
      }
    : undefined

  if (firstNeedsWork) {
    return {
      problemId: problem.id,
      headline: `Repair step ${firstNeedsWork.index + 1}`,
      detail: firstNeedsWork.detail,
      nextAction: firstNeedsWork.nextAction,
      answered,
      onTrack,
      total: targets.length,
      feedback,
      misconception,
    }
  }

  if (!firstEmpty) {
    return {
      problemId: problem.id,
      headline: 'Work path is coherent',
      detail: 'Each recorded step is aligned with the verified solution path.',
      nextAction: 'Write the final answer and submit when ready.',
      answered,
      onTrack,
      total: targets.length,
      feedback,
      misconception,
    }
  }

  return {
    problemId: problem.id,
    headline: answered ? `Continue step ${firstEmpty.index + 1}` : 'Start the work path',
    detail: answered
      ? `${onTrack}/${targets.length} steps are currently on track.`
      : 'A first setup line gives the tutor something specific to check.',
    nextAction: firstEmpty.nextAction,
    answered,
    onTrack,
    total: targets.length,
    feedback,
    misconception,
  }
}

const nextOpenRepair = (profile: LearnerProfile) =>
  profile.mistakes.find((mistake) => !mistake.resolved && mistake.misconceptionId) ??
  profile.mistakes.find((mistake) => !mistake.resolved)

const problemMatchesMisconception = (problem: Problem, misconceptionId: string) =>
  problem.mistakePatterns.some((mistake) => mistake.id === misconceptionId)

export const createProblemSet = (
  profile: LearnerProfile,
  mode: SetMode = 'adaptive',
  forcedConceptId?: ConceptId,
): ProblemSet => {
  const repairFocus = mode === 'repair' ? nextOpenRepair(profile) : undefined
  const conceptId = forcedConceptId ?? repairFocus?.conceptId ?? recommendConcept(profile)
  const conceptProblems = byConcept(conceptId)
  const prerequisiteProblems = getConcept(conceptId).prerequisites.flatMap(byConcept)
  const relatedConceptIds = new Set([
    conceptId,
    ...getConcept(conceptId).prerequisites,
  ])
  const repairFocusMisconceptionId = repairFocus?.misconceptionId
  const focusedRepairProblems =
    repairFocusMisconceptionId
      ? problemBank.filter(
          (problem) =>
            problemMatchesMisconception(problem, repairFocusMisconceptionId) &&
            relatedConceptIds.has(problem.conceptId),
        )
      : []
  const reviewConcept = concepts
    .filter((concept) => profile.mastery[concept.id] < 75)
    .sort((left, right) => profile.mastery[left.id] - profile.mastery[right.id])[0]
  const reviewProblems = reviewConcept ? byConcept(reviewConcept.id) : []
  const source =
    mode === 'repair'
      ? [...focusedRepairProblems, ...prerequisiteProblems, ...conceptProblems]
      : mode === 'challenge'
        ? [...conceptProblems.filter((problem) => problem.difficulty >= 2), ...reviewProblems]
        : [...conceptProblems, ...reviewProblems, ...prerequisiteProblems]
  const uniqueProblems = Array.from(new Map(source.map((problem) => [problem.id, problem])).values())
    .slice(0, 5)
  const createdAt = nowIso()

  return {
    id: uid('set'),
    title:
      mode === 'repair' && repairFocus
        ? `${repairFocus.label} repair set`
        : `${getConcept(conceptId).shortTitle} ${mode} set`,
    mode,
    conceptId,
    repairFocus:
      mode === 'repair' && repairFocus?.misconceptionId
        ? {
            misconceptionId: repairFocus.misconceptionId,
            label: repairFocus.label,
          }
        : undefined,
    createdAt,
    status: 'active',
    problemIds: uniqueProblems.map((problem) => problem.id),
    progress: Object.fromEntries(
      uniqueProblems.map((problem) => [
        problem.id,
        {
          problemId: problem.id,
          status: 'ready' as ProblemStatus,
          response: '',
          workSteps: [],
          score: 0,
          hintsUsed: 0,
          guideStepsUsed: 0,
        },
      ]),
    ),
  }
}

export const createLearnerProfile = (
  startingPoint: ConceptId = 'vectors',
  name = 'Learner',
): LearnerProfile => {
  const startLevel = getConcept(startingPoint).level
  const mastery = Object.fromEntries(
    concepts.map((concept) => [
      concept.id,
      concept.level < startLevel ? 72 : concept.id === startingPoint ? 38 : 18,
    ]),
  ) as Record<ConceptId, number>
  const confidence = Object.fromEntries(
    concepts.map((concept) => [
      concept.id,
      concept.level < startLevel ? 62 : concept.id === startingPoint ? 35 : 20,
    ]),
  ) as Record<ConceptId, number>
  const baseProfile: LearnerProfile = {
    name,
    startingPoint,
    currentConceptId: startingPoint,
    mastery,
    confidence,
    lessonReads: {},
    lessonCheckRecords: {},
    problemSets: [],
    attempts: [],
    mistakes: [],
    activity: [
      {
        id: uid('activity'),
        createdAt: nowIso(),
        title: 'Starting point set',
        detail: `${getConcept(startingPoint).title} is the first focus.`,
      },
    ],
  }

  return {
    ...baseProfile,
    problemSets: [createProblemSet(baseProfile, 'adaptive', startingPoint)],
  }
}

export const applyDiagnosticPlacement = (
  profile: LearnerProfile,
  responses: Record<string, string>,
): LearnerProfile => {
  const report = evaluateDiagnostic(responses)
  const strengths = new Set(report.strengths)
  const repairs = new Set(report.repairs)
  const mastery = Object.fromEntries(
    concepts.map((concept) => {
      const current = profile.mastery[concept.id] ?? 0
      if (strengths.has(concept.id)) return [concept.id, Math.max(current, 72)]
      if (repairs.has(concept.id)) return [concept.id, Math.min(current, 35)]
      return [concept.id, current]
    }),
  ) as Record<ConceptId, number>
  const confidence = Object.fromEntries(
    concepts.map((concept) => {
      const current = profile.confidence[concept.id] ?? 0
      if (strengths.has(concept.id)) return [concept.id, Math.max(current, 62)]
      if (repairs.has(concept.id)) return [concept.id, Math.min(current, 32)]
      return [concept.id, current]
    }),
  ) as Record<ConceptId, number>
  const placedProfile: LearnerProfile = {
    ...profile,
    startingPoint: report.recommendedStart,
    currentConceptId: report.recommendedStart,
    mastery,
    confidence,
    diagnostic: report,
    lessonReads: profile.lessonReads ?? {},
    lessonCheckRecords: profile.lessonCheckRecords ?? {},
    problemSets: [],
    activity: [
      {
        id: uid('activity'),
        createdAt: report.completedAt,
        title: 'Diagnostic completed',
        detail: `${report.score}/${report.total}; start at ${getConcept(report.recommendedStart).shortTitle}.`,
      },
      ...profile.activity,
    ].slice(0, 30),
  }

  return {
    ...placedProfile,
    problemSets: [createProblemSet(placedProfile, 'adaptive', report.recommendedStart)],
  }
}

export const getActiveSet = (profile: LearnerProfile, selectedSetId?: string) =>
  profile.problemSets.find((set) => set.id === selectedSetId) ??
  profile.problemSets.find((set) => set.status === 'active') ??
  profile.problemSets[0]

export const getNextProblemInSet = (set: ProblemSet) => {
  const nextProblemId =
    set.problemIds.find((problemId) => set.progress[problemId]?.status !== 'answered') ??
    set.problemIds[0]
  return getProblem(nextProblemId)
}

export const setCompletion = (set: ProblemSet) => {
  const answered = set.problemIds.filter(
    (problemId) => set.progress[problemId]?.status === 'answered',
  ).length
  return {
    answered,
    total: set.problemIds.length,
    percent: set.problemIds.length === 0 ? 0 : Math.round((answered / set.problemIds.length) * 100),
  }
}

export const recommendConcept = (profile: LearnerProfile) => {
  const repair = concepts
    .filter((concept) => profile.mastery[concept.id] < 45)
    .sort((left, right) => profile.mastery[left.id] - profile.mastery[right.id])[0]

  if (repair) return repair.id

  return (
    concepts.find((concept) =>
      concept.prerequisites.every((prereq) => profile.mastery[prereq] >= 65),
    )?.id ?? profile.currentConceptId
  )
}

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Math.round(value)))

const problemStartPrompt = (problem: Problem) => {
  if (problem.answerType === 'number') {
    return 'Name the scalar the problem is asking for before calculating.'
  }
  if (problem.answerType === 'vector') {
    return 'Write the coordinate equations or vector expression before solving.'
  }
  if (problem.answerType === 'choice') {
    return 'List the possible outcomes, then eliminate the ones the prompt contradicts.'
  }
  return 'Write one sentence that states the claim you need to prove or explain.'
}

export const createGuidedSolution = (
  problem: Problem,
  response = '',
  revealedStepCount = 0,
): GuidedSolution => {
  const feedback = evaluateResponse(problem, response)
  const solutionSteps = problem.solutionSteps.length
    ? problem.solutionSteps
    : [problem.deeperHint]
  const steps: GuidedSolutionStep[] = [
    {
      id: `${problem.id}-orient`,
      title: 'Orient',
      coachPrompt: 'What is the problem asking you to find or decide?',
      support: problemStartPrompt(problem),
      reveal: problem.hint,
      check: `Your setup should show: ${problem.checksFor}`,
    },
    {
      id: `${problem.id}-setup`,
      title: 'Set up',
      coachPrompt: 'What equation, definition, or test should start the work?',
      support: problem.deeperHint,
      reveal: solutionSteps[0],
      check: 'Pause here and write the setup in your own words.',
    },
    ...solutionSteps.slice(1).map((step, index) => ({
      id: `${problem.id}-work-${index + 1}`,
      title: `Work step ${index + 1}`,
      coachPrompt: 'Use the previous line to make the next small move.',
      support: solutionSteps[index],
      reveal: step,
      check:
        index === solutionSteps.length - 2
          ? 'Compare this result with the original prompt.'
          : 'Check the arithmetic before moving on.',
    })),
    {
      id: `${problem.id}-check`,
      title: 'Check',
      coachPrompt: 'How do you know the answer actually solves the problem?',
      support: `A complete response should match the target idea: ${problem.checksFor}`,
      reveal: `One accepted form is: ${problem.accepted[0]}`,
      check: 'Submit only after your answer explains the result, not just the final value.',
    },
  ]
  const visibleCount = Math.min(Math.max(revealedStepCount, 0), steps.length)
  const headline =
    feedback.tone === 'correct'
      ? 'You may not need the guide'
      : feedback.tone === 'mistake'
        ? `Repair first: ${feedback.headline}`
        : 'Guided solution path'
  const nudge =
    feedback.tone === 'mistake'
      ? feedback.nextAction
      : visibleCount === 0
        ? 'Ask for the first guided step when you are stuck.'
        : steps[Math.min(visibleCount, steps.length - 1)].coachPrompt

  return {
    problemId: problem.id,
    headline,
    nudge,
    steps,
    revealedSteps: steps.slice(0, visibleCount),
    nextStep: steps[visibleCount],
    completed: visibleCount >= steps.length,
  }
}

export const submitResponse = (
  profile: LearnerProfile,
  setId: string,
  problemId: string,
  response: string,
  support: { hintsUsed?: number; guideStepsUsed?: number; workSteps?: string[] } = {},
): LearnerProfile => {
  const problem = getProblem(problemId)
  const feedback = evaluateResponse(problem, response)
  const workSteps = (support.workSteps ?? []).map((step) => step.trim())
  const stepReport = evaluateWorkSteps(problem, workSteps)
  const misconceptionEvidence = feedback.mistake
    ? {
        pattern: feedback.mistake,
        source: 'final-answer' as const,
        evidence: response,
      }
    : stepReport.misconception
      ? {
          pattern: stepReport.misconception.pattern,
          source: 'work-step' as const,
          stepIndex: stepReport.misconception.stepIndex,
          evidence: stepReport.misconception.evidence,
        }
      : undefined
  const hintsUsed = support.hintsUsed ?? 0
  const guideStepsUsed = support.guideStepsUsed ?? 0
  const supportPenalty =
    feedback.tone === 'correct' ? Math.min(2, Math.floor((hintsUsed + guideStepsUsed) / 3)) : 0
  const score = Math.max(0, feedback.score - supportPenalty)
  const guidedCorrectDelta = guideStepsUsed > 0 || hintsUsed > 1 ? 5 : 8
  const masteryDelta = feedback.tone === 'correct' ? guidedCorrectDelta : score >= 3 ? 3 : -4
  const confidenceDelta = feedback.tone === 'correct' ? 6 : feedback.tone === 'mistake' ? -5 : 1
  const createdAt = nowIso()
  const attempt: Attempt = {
    id: uid('attempt'),
    problemId,
    conceptId: problem.conceptId,
    response,
    workSteps,
    score,
    feedback:
      guideStepsUsed > 0
        ? `${feedback.detail} Guided support used: ${guideStepsUsed} step${guideStepsUsed === 1 ? '' : 's'}. Work path: ${stepReport.onTrack}/${stepReport.total} steps on track.`
        : `${feedback.detail} Work path: ${stepReport.onTrack}/${stepReport.total} steps on track.`,
    hintsUsed,
    guideStepsUsed,
    mistakeLabel: misconceptionEvidence?.pattern.label,
    misconceptionId: misconceptionEvidence?.pattern.id,
    misconceptionLabel: misconceptionEvidence?.pattern.label,
    createdAt,
  }
  const mistake: MistakeRecord | null =
    misconceptionEvidence
      ? {
          id: uid('mistake'),
          conceptId: problem.conceptId,
          problemId,
          label: misconceptionEvidence.pattern.label,
          feedback: misconceptionEvidence.pattern.feedback,
          repair: misconceptionEvidence.pattern.repair,
          response,
          misconceptionId: misconceptionEvidence.pattern.id,
          source: misconceptionEvidence.source,
          stepIndex:
            misconceptionEvidence.source === 'work-step'
              ? misconceptionEvidence.stepIndex
              : undefined,
          evidence: misconceptionEvidence.evidence,
          createdAt,
          resolved: false,
        }
      : null
  const problemSets = profile.problemSets.map((set) => {
    if (set.id !== setId) return set
    const progress = {
      ...set.progress,
      [problemId]: {
        ...set.progress[problemId],
        problemId,
        status: 'answered' as ProblemStatus,
        response,
        workSteps,
        score,
        hintsUsed,
        guideStepsUsed,
        submittedAt: createdAt,
      },
    }
    const answeredCount = set.problemIds.filter(
      (id) => progress[id]?.status === 'answered',
    ).length
    return {
      ...set,
      progress,
      status:
        answeredCount === set.problemIds.length ? ('completed' as ProblemSetStatus) : set.status,
    }
  })

  return {
    ...profile,
    currentConceptId: problem.conceptId,
    mastery: {
      ...profile.mastery,
      [problem.conceptId]: clamp(profile.mastery[problem.conceptId] + masteryDelta),
    },
    confidence: {
      ...profile.confidence,
      [problem.conceptId]: clamp(profile.confidence[problem.conceptId] + confidenceDelta),
    },
    problemSets,
    attempts: [attempt, ...profile.attempts].slice(0, 30),
    mistakes: mistake ? [mistake, ...profile.mistakes].slice(0, 20) : profile.mistakes,
    activity: [
      {
        id: uid('activity'),
        createdAt,
        title:
          misconceptionEvidence
            ? 'Repair target logged'
            : guideStepsUsed > 0
              ? 'Guided problem checked'
              : feedback.tone === 'correct'
                ? 'Problem solved'
                : 'Problem checked',
        detail: misconceptionEvidence
          ? `${getConcept(problem.conceptId).shortTitle}: ${misconceptionEvidence.pattern.label}`
          : `${getConcept(problem.conceptId).shortTitle}: ${feedback.headline}`,
      },
      ...profile.activity,
    ].slice(0, 30),
  }
}

export const addProblemSet = (
  profile: LearnerProfile,
  mode: SetMode = 'adaptive',
  conceptId?: ConceptId,
): LearnerProfile => {
  const nextSet = createProblemSet(profile, mode, conceptId)
  return {
    ...profile,
    currentConceptId: nextSet.conceptId,
    problemSets: [nextSet, ...profile.problemSets],
    activity: [
      {
        id: uid('activity'),
        createdAt: nextSet.createdAt,
        title: 'Problem set created',
        detail: `${nextSet.title} is ready.`,
      },
      ...profile.activity,
    ].slice(0, 30),
  }
}

export const markLessonRead = (
  profile: LearnerProfile,
  conceptId: ConceptId,
  responses: Record<string, string> = {},
): LearnerProfile => {
  const createdAt = nowIso()
  const priorRecord = profile.lessonCheckRecords?.[conceptId]
  const checkResult = evaluateLessonChecks(conceptId, responses)
  const passed = checkResult.passed
  return {
    ...profile,
    lessonReads: {
      ...(profile.lessonReads ?? {}),
      ...(passed ? { [conceptId]: createdAt } : {}),
    },
    lessonCheckRecords: {
      ...(profile.lessonCheckRecords ?? {}),
      [conceptId]: {
        conceptId,
        completedAt: passed ? createdAt : priorRecord?.completedAt,
        attempts: (priorRecord?.attempts ?? 0) + 1,
        responses,
        passed,
      },
    },
    activity: [
      {
        id: uid('activity'),
        createdAt,
        title: passed ? 'Lesson completed' : 'Lesson check attempted',
        detail: passed
          ? `${getConcept(conceptId).shortTitle}: theory checked before practice.`
          : `${getConcept(conceptId).shortTitle}: review lesson checks before practice.`,
      },
      ...profile.activity,
    ].slice(0, 30),
  }
}

export const resolveMistake = (
  profile: LearnerProfile,
  mistakeId: string,
): LearnerProfile => ({
  ...profile,
  mistakes: profile.mistakes.map((mistake) =>
    mistake.id === mistakeId ? { ...mistake, resolved: true } : mistake,
  ),
})

export const overallMastery = (profile: LearnerProfile) =>
  Math.round(
    concepts.reduce((total, concept) => total + profile.mastery[concept.id], 0) /
      concepts.length,
  )
