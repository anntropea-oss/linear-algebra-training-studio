export const stageOrder = [
  'Orientation',
  'Systems',
  'Structure',
  'Geometry',
  'Spectral',
] as const

export type Stage = (typeof stageOrder)[number]

export type SkillId = string

export type Outcome = 'correct' | 'mistake'

export type ActivityType =
  | 'diagnostic'
  | 'assignment'
  | 'practice'
  | 'mistake'
  | 'download'

export type LearnerSkillState = {
  mastery: number
  confidence: number
  attempts: number
  lastPracticed: string
  trend: number
}

export type Skill = {
  id: SkillId
  name: string
  stage: Stage
  level: number
  prerequisites: SkillId[]
  masteryGoal: string
  diagnosticPrompt: string
  misconceptions: string[]
}

export type MistakeEvent = {
  id: string
  date: string
  skillId: SkillId
  problem: string
  misconception: string
  learnerAnswer: string
  correction: string
  severity: 'light' | 'medium' | 'heavy'
}

export type ActivityEvent = {
  id: string
  date: string
  type: ActivityType
  title: string
  detail: string
}

export type AssignmentProblem = {
  id: string
  skillId: SkillId
  prompt: string
  hint: string
  solution: string
  difficulty: number
  checksFor: string
}

export type Assignment = {
  id: string
  title: string
  learnerId: string
  createdAt: string
  dueAt: string
  focusSkillIds: SkillId[]
  problems: AssignmentProblem[]
  coachingNotes: string[]
  estimatedMinutes: number
}

export type Learner = {
  id: string
  name: string
  cohort: string
  avatarColor: string
  levelName: string
  diagnosticScore: number
  weeklyGoalMinutes: number
  minutesThisWeek: number
  streakDays: number
  skills: Record<SkillId, LearnerSkillState>
  mistakeLog: MistakeEvent[]
  activityLog: ActivityEvent[]
}

type ProblemTemplate = {
  prompt: string
  hint: string
  solution: string
  difficulty: number
  checksFor: string
}

const todayIso = () => new Date().toISOString()

const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next.toISOString()
}

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Math.round(value)))

const shortId = (input: string) => {
  let hash = 0
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0
  }
  return hash.toString(36).slice(0, 6).toUpperCase()
}

export const skillCatalog: Skill[] = [
  {
    id: 'vec-combinations',
    name: 'Vectors and linear combinations',
    stage: 'Orientation',
    level: 1,
    prerequisites: [],
    masteryGoal: 'Build and interpret vectors as weighted combinations.',
    diagnosticPrompt: 'Write (5, 1) as a combination of (1, 0) and (0, 1).',
    misconceptions: [
      'Treats vectors as disconnected coordinate pairs instead of movable objects.',
      'Combines coordinates without tracking scalar weights.',
    ],
  },
  {
    id: 'span',
    name: 'Span',
    stage: 'Orientation',
    level: 1,
    prerequisites: ['vec-combinations'],
    masteryGoal: 'Decide what set of outputs a group of vectors can reach.',
    diagnosticPrompt: 'Can (1, 2) and (2, 4) span all of R^2? Explain.',
    misconceptions: [
      'Counts the number of vectors without checking whether directions repeat.',
      'Confuses a single reachable vector with the full span.',
    ],
  },
  {
    id: 'linear-independence',
    name: 'Linear independence',
    stage: 'Orientation',
    level: 2,
    prerequisites: ['span'],
    masteryGoal: 'Detect redundant vectors through equations and geometry.',
    diagnosticPrompt: 'Are (1, 3), (2, 6), and (0, 1) independent?',
    misconceptions: [
      'Assumes nonzero vectors are automatically independent.',
      'Misses that one vector can be made from the others.',
    ],
  },
  {
    id: 'systems',
    name: 'Systems of equations',
    stage: 'Systems',
    level: 2,
    prerequisites: ['vec-combinations'],
    masteryGoal: 'Translate systems into matrix form and interpret solution sets.',
    diagnosticPrompt: 'Solve x + y = 5 and 2x - y = 1.',
    misconceptions: [
      'Solves equations mechanically without interpreting the solution.',
      'Drops signs while eliminating variables.',
    ],
  },
  {
    id: 'row-reduction',
    name: 'Row reduction',
    stage: 'Systems',
    level: 2,
    prerequisites: ['systems'],
    masteryGoal: 'Use row operations to find pivots, free variables, and rank.',
    diagnosticPrompt: 'Row reduce [[1, 2, 5], [2, 4, 10]].',
    misconceptions: [
      'Uses invalid row operations that change the solution set.',
      'Cannot connect pivot columns to variables.',
    ],
  },
  {
    id: 'matrix-operations',
    name: 'Matrix operations',
    stage: 'Systems',
    level: 2,
    prerequisites: ['systems'],
    masteryGoal: 'Multiply and compose matrices with dimensional awareness.',
    diagnosticPrompt: 'When is AB defined if A is 2x3 and B is m x n?',
    misconceptions: [
      'Multiplies matrices entry-by-entry.',
      'Ignores shape compatibility before computing.',
    ],
  },
  {
    id: 'subspaces',
    name: 'Subspaces',
    stage: 'Structure',
    level: 3,
    prerequisites: ['span', 'linear-independence'],
    masteryGoal: 'Verify closure rules and recognize common subspaces.',
    diagnosticPrompt: 'Is the set of vectors (x, y) with x + y = 1 a subspace?',
    misconceptions: [
      'Checks only one subspace condition.',
      'Forgets that every subspace must contain the zero vector.',
    ],
  },
  {
    id: 'basis-dimension',
    name: 'Basis and dimension',
    stage: 'Structure',
    level: 3,
    prerequisites: ['linear-independence', 'row-reduction'],
    masteryGoal: 'Find efficient coordinate systems for spaces and subspaces.',
    diagnosticPrompt: 'Give a basis for the span of (1, 2), (2, 4), and (0, 1).',
    misconceptions: [
      'Lists spanning vectors without removing redundancy.',
      'Confuses number of vectors with dimension.',
    ],
  },
  {
    id: 'linear-transformations',
    name: 'Linear transformations',
    stage: 'Geometry',
    level: 3,
    prerequisites: ['matrix-operations', 'basis-dimension'],
    masteryGoal: 'Connect matrices, transformations, kernels, and images.',
    diagnosticPrompt: 'Describe what [[0, -1], [1, 0]] does to the plane.',
    misconceptions: [
      'Treats a transformation as a table of numbers only.',
      'Cannot connect columns of a matrix to images of basis vectors.',
    ],
  },
  {
    id: 'orthogonality',
    name: 'Orthogonality',
    stage: 'Geometry',
    level: 3,
    prerequisites: ['vec-combinations'],
    masteryGoal: 'Use dot products to measure angle, length, and perpendicularity.',
    diagnosticPrompt: 'Are (2, -1, 3) and (1, 2, 0) orthogonal?',
    misconceptions: [
      'Uses slope rules outside R^2.',
      'Computes the dot product but misses its meaning.',
    ],
  },
  {
    id: 'projections',
    name: 'Projections and least squares',
    stage: 'Geometry',
    level: 4,
    prerequisites: ['orthogonality', 'basis-dimension'],
    masteryGoal: 'Project vectors onto lines, planes, and column spaces.',
    diagnosticPrompt: 'Project (3, 4) onto the span of (1, 0).',
    misconceptions: [
      'Projects by matching one coordinate instead of using dot products.',
      'Confuses closest vector with original vector.',
    ],
  },
  {
    id: 'determinants',
    name: 'Determinants',
    stage: 'Structure',
    level: 4,
    prerequisites: ['matrix-operations'],
    masteryGoal: 'Interpret determinants as signed scale factors and invertibility tests.',
    diagnosticPrompt: 'What does det(A) = 0 say about a 2x2 transformation?',
    misconceptions: [
      'Treats determinant as only a formula.',
      'Misses the link between zero determinant and collapsed dimension.',
    ],
  },
  {
    id: 'eigen',
    name: 'Eigenvalues and eigenvectors',
    stage: 'Spectral',
    level: 4,
    prerequisites: ['determinants', 'linear-transformations'],
    masteryGoal: 'Find directions that remain on their own span under a transformation.',
    diagnosticPrompt: 'If Av = 3v, what are the eigenvalue and eigenvector?',
    misconceptions: [
      'Thinks eigenvectors are unchanged instead of scaled.',
      'Solves det(A) instead of det(A - lambda I).',
    ],
  },
  {
    id: 'diagonalization',
    name: 'Diagonalization',
    stage: 'Spectral',
    level: 5,
    prerequisites: ['eigen', 'basis-dimension'],
    masteryGoal: 'Use eigenbases to simplify repeated transformations.',
    diagnosticPrompt: 'What condition lets A be written as PDP^-1?',
    misconceptions: [
      'Assumes every square matrix can be diagonalized.',
      'Finds eigenvalues but does not check for enough independent eigenvectors.',
    ],
  },
]

const problemBank: Record<SkillId, ProblemTemplate[]> = {
  'vec-combinations': [
    {
      prompt: 'Find scalars a and b so that a(1, 2) + b(3, 1) = (7, 8).',
      hint: 'Turn the vector equation into two scalar equations.',
      solution: 'a = 17/5 and b = 6/5.',
      difficulty: 1,
      checksFor: 'Can translate linear combinations into a solvable system.',
    },
    {
      prompt: 'Write (4, -2, 5) as a combination of e1, e2, and e3.',
      hint: 'The standard basis vectors carry one coordinate each.',
      solution: '(4, -2, 5) = 4e1 - 2e2 + 5e3.',
      difficulty: 1,
      checksFor: 'Understands standard coordinates as basis weights.',
    },
    {
      prompt: 'Describe all combinations of (1, 1) and (2, 2).',
      hint: 'Check whether the second vector adds a new direction.',
      solution: 'They produce the line y = x, not all of R^2.',
      difficulty: 2,
      checksFor: 'Connects repeated direction to a one-dimensional span.',
    },
  ],
  span: [
    {
      prompt: 'Do (1, 0) and (1, 1) span R^2? Justify your answer.',
      hint: 'Ask whether any (x, y) can be created from the two vectors.',
      solution: 'Yes. b(1, 1) gives the y coordinate, and a(1, 0) adjusts x.',
      difficulty: 1,
      checksFor: 'Can justify spanning with arbitrary coordinates.',
    },
    {
      prompt: 'Do (2, 4), (1, 2), and (3, 6) span R^2?',
      hint: 'Check whether all three vectors point along the same line.',
      solution: 'No. All are multiples of (1, 2), so the span is a line.',
      difficulty: 1,
      checksFor: 'Detects collinear vectors.',
    },
    {
      prompt: 'Find one vector in R^3 that is not in span{(1, 0, 1), (0, 1, 1)}.',
      hint: 'Every combination has third coordinate equal to x + y.',
      solution: '(0, 0, 1) is not in the span.',
      difficulty: 3,
      checksFor: 'Can characterize a span before choosing a counterexample.',
    },
  ],
  'linear-independence': [
    {
      prompt: 'Are (1, 2) and (2, 4) linearly independent?',
      hint: 'Check whether one vector is a scalar multiple of the other.',
      solution: 'No. (2, 4) = 2(1, 2).',
      difficulty: 1,
      checksFor: 'Recognizes direct scalar redundancy.',
    },
    {
      prompt: 'Determine whether (1, 0, 1), (0, 1, 1), and (1, 1, 2) are independent.',
      hint: 'Compare the third vector with the sum of the first two.',
      solution: 'They are dependent because the third vector is the sum of the first two.',
      difficulty: 2,
      checksFor: 'Finds a nontrivial dependence relation.',
    },
    {
      prompt: 'Explain why three vectors in R^2 cannot be linearly independent.',
      hint: 'Compare the number of vectors with the dimension of the space.',
      solution: 'R^2 has dimension 2, so at most two vectors can be independent.',
      difficulty: 2,
      checksFor: 'Uses dimension as a structural limit.',
    },
  ],
  systems: [
    {
      prompt: 'Solve x + y = 6 and x - y = 2.',
      hint: 'Add the equations first.',
      solution: 'x = 4 and y = 2.',
      difficulty: 1,
      checksFor: 'Can solve a 2x2 system without losing signs.',
    },
    {
      prompt: 'A system has equations x + 2y = 3 and 2x + 4y = 8. What happens?',
      hint: 'Compare the left sides and right sides.',
      solution: 'There is no solution. The left side doubles, but 3 does not double to 8.',
      difficulty: 2,
      checksFor: 'Identifies inconsistency.',
    },
    {
      prompt: 'Give a geometric meaning for a 2x2 system with infinitely many solutions.',
      hint: 'Think of each equation as a line.',
      solution: 'The two equations describe the same line.',
      difficulty: 2,
      checksFor: 'Connects algebraic solutions to geometry.',
    },
  ],
  'row-reduction': [
    {
      prompt: 'Row reduce the augmented matrix [[1, 2, 5], [0, 1, 1]].',
      hint: 'Use the pivot in row 2 to clear the 2 above it.',
      solution: 'R1 <- R1 - 2R2 gives [[1, 0, 3], [0, 1, 1]], so x = 3 and y = 1.',
      difficulty: 1,
      checksFor: 'Performs a valid row operation and reads the solution.',
    },
    {
      prompt: 'In RREF, what does a column without a pivot mean for a variable?',
      hint: 'A non-pivot variable is not forced by an equation.',
      solution: 'It is a free variable.',
      difficulty: 1,
      checksFor: 'Connects pivots to free variables.',
    },
    {
      prompt: 'Row reduce [[1, 2, 0], [2, 4, 0], [0, 1, 3]] and find the rank.',
      hint: 'One row is a multiple of another.',
      solution: 'There are two pivot rows, so the rank is 2.',
      difficulty: 3,
      checksFor: 'Separates redundant rows from pivot information.',
    },
  ],
  'matrix-operations': [
    {
      prompt: 'If A is 2x3 and B is 3x4, what is the shape of AB?',
      hint: 'Inner dimensions must match; outer dimensions remain.',
      solution: 'AB is 2x4.',
      difficulty: 1,
      checksFor: 'Checks matrix shape before computing.',
    },
    {
      prompt: 'Compute [[1, 2], [0, 1]] times [[3], [4]].',
      hint: 'Each output entry is a row dot column.',
      solution: 'The product is [[11], [4]].',
      difficulty: 1,
      checksFor: 'Uses row-column multiplication.',
    },
    {
      prompt: 'Explain why AB and BA can be different.',
      hint: 'Think about transformations happening in different orders.',
      solution: 'Matrix multiplication represents composition, and changing order can change the result.',
      difficulty: 2,
      checksFor: 'Understands noncommutativity conceptually.',
    },
  ],
  subspaces: [
    {
      prompt: 'Is the set {(x, y): x + y = 0} a subspace of R^2?',
      hint: 'Check zero, addition, and scalar multiplication.',
      solution: 'Yes. It contains zero and is closed under addition and scalar multiplication.',
      difficulty: 1,
      checksFor: 'Applies the subspace test.',
    },
    {
      prompt: 'Is the set {(x, y): x + y = 1} a subspace of R^2?',
      hint: 'Start by checking whether (0, 0) is in the set.',
      solution: 'No. It does not contain the zero vector.',
      difficulty: 1,
      checksFor: 'Uses zero vector as a fast disqualifier.',
    },
    {
      prompt: 'Explain why the solution set of Ax = 0 is always a subspace.',
      hint: 'Use linearity of matrix multiplication.',
      solution: 'If Au = 0 and Av = 0, then A(u + v) = 0 and A(cu) = 0.',
      difficulty: 3,
      checksFor: 'Connects homogeneous systems to closure.',
    },
  ],
  'basis-dimension': [
    {
      prompt: 'Find a basis for span{(1, 2), (2, 4), (0, 1)}.',
      hint: 'Remove the vector that is a multiple of another.',
      solution: 'One basis is {(1, 2), (0, 1)}.',
      difficulty: 1,
      checksFor: 'Removes redundant spanning vectors.',
    },
    {
      prompt: 'What is the dimension of the plane x + y + z = 0 in R^3?',
      hint: 'One independent equation in R^3 leaves two free directions.',
      solution: 'The dimension is 2.',
      difficulty: 2,
      checksFor: 'Relates constraints to dimension.',
    },
    {
      prompt: 'Give a basis for the null space of [1 2 3].',
      hint: 'Solve x + 2y + 3z = 0 using two free variables.',
      solution: 'One basis is {(-2, 1, 0), (-3, 0, 1)}.',
      difficulty: 3,
      checksFor: 'Builds a basis from parametric solutions.',
    },
  ],
  'linear-transformations': [
    {
      prompt: 'What does the matrix [[2, 0], [0, 3]] do to (x, y)?',
      hint: 'Multiply the matrix by (x, y).',
      solution: 'It sends (x, y) to (2x, 3y).',
      difficulty: 1,
      checksFor: 'Interprets a diagonal matrix geometrically.',
    },
    {
      prompt: 'Find the matrix that sends e1 to (1, 2) and e2 to (3, 4).',
      hint: 'The images of basis vectors become the columns.',
      solution: 'The matrix is [[1, 3], [2, 4]].',
      difficulty: 2,
      checksFor: 'Connects matrix columns to basis images.',
    },
    {
      prompt: 'Describe the kernel of a transformation in plain language.',
      hint: 'Ask which inputs get collapsed to zero.',
      solution: 'The kernel is the set of input vectors sent to the zero vector.',
      difficulty: 2,
      checksFor: 'Understands kernel as a set of collapsed directions.',
    },
  ],
  orthogonality: [
    {
      prompt: 'Are (2, -1, 3) and (1, 2, 0) orthogonal?',
      hint: 'Compute the dot product.',
      solution: 'Yes. 2(1) + (-1)(2) + 3(0) = 0.',
      difficulty: 1,
      checksFor: 'Uses dot product to test orthogonality.',
    },
    {
      prompt: 'Find a nonzero vector orthogonal to (3, 4) in R^2.',
      hint: 'Swap coordinates and change one sign.',
      solution: 'One answer is (4, -3).',
      difficulty: 1,
      checksFor: 'Builds perpendicular vectors.',
    },
    {
      prompt: 'Why is an orthogonal basis convenient for coordinates?',
      hint: 'Think about isolating each direction with a dot product.',
      solution: 'Each coordinate can be found independently by projection.',
      difficulty: 3,
      checksFor: 'Sees computational value of orthogonality.',
    },
  ],
  projections: [
    {
      prompt: 'Project (3, 4) onto the span of (1, 0).',
      hint: 'Only the horizontal component remains.',
      solution: 'The projection is (3, 0).',
      difficulty: 1,
      checksFor: 'Interprets projection onto an axis.',
    },
    {
      prompt: 'Project (2, 3) onto the span of (1, 1).',
      hint: 'Use proj_u(v) = (v dot u)/(u dot u) times u.',
      solution: 'The projection is (5/2, 5/2).',
      difficulty: 2,
      checksFor: 'Applies the projection formula.',
    },
    {
      prompt: 'What does a least squares solution minimize?',
      hint: 'Think about the residual vector b - Ax.',
      solution: 'It minimizes the length of the residual b - Ax.',
      difficulty: 3,
      checksFor: 'Connects least squares to closest approximation.',
    },
  ],
  determinants: [
    {
      prompt: 'Compute det([[2, 1], [5, 3]]).',
      hint: 'For [[a, b], [c, d]], use ad - bc.',
      solution: 'The determinant is 2(3) - 1(5) = 1.',
      difficulty: 1,
      checksFor: 'Computes a 2x2 determinant.',
    },
    {
      prompt: 'What does det(A) = 0 mean geometrically for a 2x2 matrix?',
      hint: 'Think about area scaling.',
      solution: 'The transformation collapses area to zero, so it is not invertible.',
      difficulty: 2,
      checksFor: 'Links determinant to invertibility and collapse.',
    },
    {
      prompt: 'If det(A) = -4 in R^2, what happens to signed area?',
      hint: 'Magnitude scales area; sign records orientation.',
      solution: 'Area is scaled by 4 and orientation is reversed.',
      difficulty: 3,
      checksFor: 'Interprets determinant sign and magnitude.',
    },
  ],
  eigen: [
    {
      prompt: 'If Av = 5v for nonzero v, identify the eigenvalue.',
      hint: 'Compare the equation to Av = lambda v.',
      solution: 'The eigenvalue is 5.',
      difficulty: 1,
      checksFor: 'Recognizes eigenvalue notation.',
    },
    {
      prompt: 'Find the eigenvalues of [[2, 0], [0, 3]].',
      hint: 'Diagonal matrices reveal their eigenvalues on the diagonal.',
      solution: 'The eigenvalues are 2 and 3.',
      difficulty: 1,
      checksFor: 'Reads eigenvalues from a diagonal matrix.',
    },
    {
      prompt: 'Why must an eigenvector be nonzero?',
      hint: 'The zero vector satisfies Av = lambda v for every lambda.',
      solution: 'Zero would make every scalar look like an eigenvalue, so it is excluded.',
      difficulty: 2,
      checksFor: 'Understands the nonzero condition.',
    },
  ],
  diagonalization: [
    {
      prompt: 'What does A = PDP^-1 mean in diagonalization?',
      hint: 'P changes coordinates into an eigenvector basis.',
      solution: 'A acts like the diagonal matrix D after changing into the eigenbasis.',
      difficulty: 2,
      checksFor: 'Understands diagonalization as a change of basis.',
    },
    {
      prompt: 'A 2x2 matrix has two independent eigenvectors. What can you conclude?',
      hint: 'Independent eigenvectors can form a basis of R^2.',
      solution: 'The matrix is diagonalizable.',
      difficulty: 2,
      checksFor: 'Connects eigenbasis existence to diagonalization.',
    },
    {
      prompt: 'Why is diagonalization useful for computing A^n?',
      hint: 'Powers of diagonal matrices are easy.',
      solution: 'If A = PDP^-1, then A^n = PD^nP^-1.',
      difficulty: 3,
      checksFor: 'Uses diagonalization for repeated transformations.',
    },
  ],
}

const baseSkillState = (
  mastery: number,
  confidence: number,
  attempts: number,
  lastPracticedDaysAgo: number,
  trend = 1,
): LearnerSkillState => ({
  mastery,
  confidence,
  attempts,
  lastPracticed: daysAgo(lastPracticedDaysAgo),
  trend,
})

const buildSkillStates = (
  values: Record<SkillId, [number, number, number, number, number?]>,
) =>
  Object.fromEntries(
    skillCatalog.map((skill) => {
      const fallback: [number, number, number, number, number] = [25, 30, 0, 30, 0]
      const [mastery, confidence, attempts, lastPracticedDaysAgo, trend = 0] =
        values[skill.id] ?? fallback
      return [
        skill.id,
        baseSkillState(mastery, confidence, attempts, lastPracticedDaysAgo, trend),
      ]
    }),
  ) as Record<SkillId, LearnerSkillState>

const mistake = (
  learner: string,
  skillId: SkillId,
  daysBack: number,
  problem: string,
  misconception: string,
  correction: string,
  severity: MistakeEvent['severity'],
): MistakeEvent => ({
  id: `M-${learner}-${shortId(`${skillId}-${problem}-${daysBack}`)}`,
  date: daysAgo(daysBack),
  skillId,
  problem,
  misconception,
  learnerAnswer: 'See instructor review notes.',
  correction,
  severity,
})

const activity = (
  learner: string,
  type: ActivityType,
  daysBack: number,
  title: string,
  detail: string,
): ActivityEvent => ({
  id: `A-${learner}-${shortId(`${type}-${title}-${daysBack}`)}`,
  date: daysAgo(daysBack),
  type,
  title,
  detail,
})

export const initialLearners: Learner[] = [
  {
    id: 'mina',
    name: 'Mina Patel',
    cohort: 'Foundations',
    avatarColor: '#0f766e',
    levelName: 'Vector Apprentice',
    diagnosticScore: 42,
    weeklyGoalMinutes: 180,
    minutesThisWeek: 92,
    streakDays: 4,
    skills: buildSkillStates({
      'vec-combinations': [72, 70, 12, 1, 1],
      span: [58, 54, 9, 3, 1],
      'linear-independence': [41, 38, 5, 5, -1],
      systems: [66, 61, 11, 2, 1],
      'row-reduction': [45, 42, 6, 6, -1],
      'matrix-operations': [51, 48, 7, 4, 0],
      subspaces: [24, 25, 2, 14, 0],
      'basis-dimension': [20, 22, 1, 17, 0],
      'linear-transformations': [18, 20, 0, 24, 0],
      orthogonality: [36, 40, 3, 10, 1],
      projections: [12, 16, 0, 28, 0],
      determinants: [25, 30, 2, 13, 0],
      eigen: [10, 12, 0, 30, 0],
      diagonalization: [6, 10, 0, 30, 0],
    }),
    mistakeLog: [
      mistake(
        'mina',
        'linear-independence',
        1,
        'Are (1, 3), (2, 6), and (0, 1) independent?',
        'Assumed nonzero vectors are automatically independent.',
        'Check whether one vector can be built from the others before deciding.',
        'medium',
      ),
      mistake(
        'mina',
        'row-reduction',
        4,
        'Reduce [[1, 2, 5], [2, 4, 9]].',
        'Used an invalid row operation that changed the solution set.',
        'Use only row swaps, row scaling, and row replacement.',
        'heavy',
      ),
    ],
    activityLog: [
      activity('mina', 'diagnostic', 8, 'Diagnostic completed', 'Placed into Foundations with strong vector intuition.'),
      activity('mina', 'practice', 3, 'Systems practice', 'Improved sign handling across 6 problems.'),
      activity('mina', 'mistake', 1, 'Independence review', 'Needs redundancy checks before declaring independence.'),
    ],
  },
  {
    id: 'theo',
    name: 'Theo Garcia',
    cohort: 'Bridge',
    avatarColor: '#b45309',
    levelName: 'Matrix Builder',
    diagnosticScore: 64,
    weeklyGoalMinutes: 210,
    minutesThisWeek: 166,
    streakDays: 9,
    skills: buildSkillStates({
      'vec-combinations': [86, 82, 19, 1, 1],
      span: [78, 76, 16, 2, 1],
      'linear-independence': [72, 68, 14, 1, 1],
      systems: [83, 80, 21, 2, 1],
      'row-reduction': [70, 64, 17, 5, 0],
      'matrix-operations': [74, 70, 16, 3, 1],
      subspaces: [57, 52, 9, 8, -1],
      'basis-dimension': [50, 46, 8, 9, -1],
      'linear-transformations': [55, 50, 7, 11, 0],
      orthogonality: [69, 62, 11, 5, 1],
      projections: [38, 34, 3, 14, -1],
      determinants: [63, 58, 8, 6, 1],
      eigen: [28, 25, 2, 20, 0],
      diagonalization: [16, 14, 0, 30, 0],
    }),
    mistakeLog: [
      mistake(
        'theo',
        'basis-dimension',
        2,
        'Find a basis for span{(1, 2), (2, 4), (0, 1)}.',
        'Listed all spanning vectors without removing redundancy.',
        'A basis must span and be independent, so remove multiples.',
        'medium',
      ),
      mistake(
        'theo',
        'projections',
        6,
        'Project (2, 3) onto span{(1, 1)}.',
        'Projected by copying a coordinate instead of using dot products.',
        'Use (v dot u)/(u dot u) times u for projection onto a line.',
        'medium',
      ),
    ],
    activityLog: [
      activity('theo', 'diagnostic', 14, 'Diagnostic completed', 'Placed into Bridge with strong systems skills.'),
      activity('theo', 'assignment', 5, 'Structure set assigned', 'Focused on basis, dimension, and subspaces.'),
      activity('theo', 'practice', 2, 'Basis repair', 'Removed redundant spanning vectors in 4 of 5 attempts.'),
    ],
  },
  {
    id: 'iris',
    name: 'Iris Chen',
    cohort: 'Spectral',
    avatarColor: '#be123c',
    levelName: 'Transformation Analyst',
    diagnosticScore: 81,
    weeklyGoalMinutes: 240,
    minutesThisWeek: 214,
    streakDays: 12,
    skills: buildSkillStates({
      'vec-combinations': [94, 90, 30, 1, 1],
      span: [91, 88, 27, 2, 1],
      'linear-independence': [88, 84, 25, 1, 1],
      systems: [92, 88, 30, 2, 1],
      'row-reduction': [84, 78, 24, 4, 0],
      'matrix-operations': [86, 82, 22, 3, 1],
      subspaces: [80, 76, 18, 4, 1],
      'basis-dimension': [77, 72, 17, 6, 0],
      'linear-transformations': [83, 80, 19, 3, 1],
      orthogonality: [75, 70, 15, 7, 0],
      projections: [63, 58, 9, 9, -1],
      determinants: [81, 76, 16, 4, 1],
      eigen: [59, 52, 8, 11, -1],
      diagonalization: [43, 38, 4, 16, -1],
    }),
    mistakeLog: [
      mistake(
        'iris',
        'eigen',
        3,
        'Find eigenvalues of [[4, 1], [0, 4]].',
        'Found the repeated eigenvalue but assumed two eigenvectors.',
        'After eigenvalues, solve for eigenspace dimension before diagonalizing.',
        'medium',
      ),
      mistake(
        'iris',
        'diagonalization',
        7,
        'Decide whether a 2x2 matrix with one eigenline is diagonalizable.',
        'Assumed every matrix with eigenvalues can be diagonalized.',
        'Diagonalization needs enough independent eigenvectors for a basis.',
        'heavy',
      ),
    ],
    activityLog: [
      activity('iris', 'diagnostic', 21, 'Diagnostic completed', 'Placed into Spectral track with advanced transformation fluency.'),
      activity('iris', 'assignment', 8, 'Eigen set assigned', 'Focused on eigenspaces and diagonalization checks.'),
      activity('iris', 'mistake', 3, 'Eigenspace correction', 'Needs independent eigenvector checks after repeated eigenvalues.'),
    ],
  },
]

export const getSkill = (skillId: SkillId) =>
  skillCatalog.find((skill) => skill.id === skillId) ?? skillCatalog[0]

export const averageMastery = (learner: Learner) => {
  const total = skillCatalog.reduce(
    (sum, skill) => sum + learner.skills[skill.id].mastery,
    0,
  )
  return Math.round(total / skillCatalog.length)
}

export const stageMastery = (learner: Learner) =>
  stageOrder.map((stage) => {
    const stageSkills = skillCatalog.filter((skill) => skill.stage === stage)
    const mastery =
      stageSkills.reduce((sum, skill) => sum + learner.skills[skill.id].mastery, 0) /
      stageSkills.length
    return {
      stage,
      mastery: Math.round(mastery),
      confidence: Math.round(
        stageSkills.reduce(
          (sum, skill) => sum + learner.skills[skill.id].confidence,
          0,
        ) / stageSkills.length,
      ),
    }
  })

export const weakestSkills = (learner: Learner, count = 4) =>
  [...skillCatalog]
    .sort((left, right) => {
      const leftState = learner.skills[left.id]
      const rightState = learner.skills[right.id]
      return leftState.mastery - rightState.mastery
    })
    .slice(0, count)

const reviewDebt = (lastPracticed: string) => {
  const last = new Date(lastPracticed).getTime()
  const days = Math.max(0, (Date.now() - last) / 86400000)
  if (days > 21) return 16
  if (days > 10) return 10
  if (days > 5) return 5
  return 0
}

const templateForSkill = (
  skillId: SkillId,
  desiredDifficulty: number,
  seed: string,
) => {
  const templates = problemBank[skillId] ?? problemBank['vec-combinations']
  const candidates = templates.filter(
    (template) => template.difficulty <= desiredDifficulty,
  )
  const usable = candidates.length > 0 ? candidates : templates
  return usable[Number.parseInt(shortId(seed), 36) % usable.length]
}

export const generateAssignment = (
  learner: Learner,
  requestedAt = todayIso(),
): Assignment => {
  const scoredSkills = skillCatalog
    .map((skill) => {
      const state = learner.skills[skill.id]
      const recentMistakes = learner.mistakeLog.filter(
        (entry) => entry.skillId === skill.id,
      ).length
      const prerequisiteGap = skill.prerequisites.some(
        (prereq) => learner.skills[prereq].mastery < 60,
      )
        ? 12
        : 0
      const score =
        100 -
        state.mastery +
        (100 - state.confidence) * 0.12 +
        recentMistakes * 9 +
        prerequisiteGap +
        reviewDebt(state.lastPracticed)
      return { skill, score }
    })
    .sort((left, right) => right.score - left.score)

  const focusSkillIds = scoredSkills.slice(0, 4).map(({ skill }) => skill.id)
  const problems = focusSkillIds.flatMap((skillId, focusIndex) => {
    const state = learner.skills[skillId]
    const desiredDifficulty = state.mastery < 45 ? 1 : state.mastery < 75 ? 2 : 3
    const first = templateForSkill(
      skillId,
      desiredDifficulty,
      `${requestedAt}-${learner.id}-${skillId}-a`,
    )
    const secondSkill = focusSkillIds[(focusIndex + 1) % focusSkillIds.length]
    const secondState = learner.skills[secondSkill]
    const second = templateForSkill(
      secondSkill,
      secondState.mastery < 45 ? 1 : secondState.mastery < 75 ? 2 : 3,
      `${requestedAt}-${learner.id}-${skillId}-b`,
    )
    return [
      {
        ...first,
        id: `P-${shortId(`${requestedAt}-${skillId}-1`)}`,
        skillId,
      },
      {
        ...second,
        id: `P-${shortId(`${requestedAt}-${secondSkill}-2`)}`,
        skillId: secondSkill,
      },
    ]
  })

  const uniqueProblems = Array.from(
    new Map(problems.map((problem) => [problem.id, problem])).values(),
  ).slice(0, 6)

  return {
    id: `HW-${learner.id.toUpperCase()}-${shortId(requestedAt)}`,
    title: `${learner.name.split(' ')[0]}'s adaptive linear algebra set`,
    learnerId: learner.id,
    createdAt: requestedAt,
    dueAt: addDays(new Date(requestedAt), 7),
    focusSkillIds,
    problems: uniqueProblems,
    coachingNotes: focusSkillIds.map((skillId) => {
      const skill = getSkill(skillId)
      const state = learner.skills[skillId]
      return `${skill.name}: target ${skill.masteryGoal.toLowerCase()} Current mastery ${state.mastery}%.`
    }),
    estimatedMinutes: 12 + uniqueProblems.length * 7,
  }
}

export const recordPracticeResult = (
  learner: Learner,
  skillId: SkillId,
  outcome: Outcome,
  note: string,
): Learner => {
  const skill = getSkill(skillId)
  const previous = learner.skills[skillId]
  const correct = outcome === 'correct'
  const nextSkillState: LearnerSkillState = {
    mastery: clamp(previous.mastery + (correct ? 5 : -6)),
    confidence: clamp(previous.confidence + (correct ? 4 : -5)),
    attempts: previous.attempts + 1,
    lastPracticed: todayIso(),
    trend: correct ? 1 : -1,
  }
  const idSeed = `${learner.id}-${skillId}-${Date.now()}`
  const activityEntry: ActivityEvent = {
    id: `A-${shortId(idSeed)}`,
    date: todayIso(),
    type: correct ? 'practice' : 'mistake',
    title: correct ? `${skill.name} strengthened` : `${skill.name} mistake logged`,
    detail:
      note.trim() ||
      (correct
        ? 'Practice result raised mastery and confidence.'
        : 'Mistake added to the review queue.'),
  }
  const mistakeEntry: MistakeEvent | null = correct
    ? null
    : {
        id: `M-${shortId(idSeed)}`,
        date: todayIso(),
        skillId,
        problem: `Practice check for ${skill.name}`,
        misconception: skill.misconceptions[0],
        learnerAnswer: note.trim() || 'No learner answer recorded.',
        correction: `Review: ${skill.masteryGoal}`,
        severity: previous.mastery < 40 ? 'heavy' : 'medium',
      }

  return {
    ...learner,
    minutesThisWeek: learner.minutesThisWeek + 8,
    skills: {
      ...learner.skills,
      [skillId]: nextSkillState,
    },
    mistakeLog: mistakeEntry
      ? [mistakeEntry, ...learner.mistakeLog].slice(0, 12)
      : learner.mistakeLog,
    activityLog: [activityEntry, ...learner.activityLog].slice(0, 16),
  }
}

export const logAssignment = (learner: Learner, assignment: Assignment): Learner => {
  const event: ActivityEvent = {
    id: `A-${shortId(`${assignment.id}-assigned`)}`,
    date: todayIso(),
    type: 'assignment',
    title: 'Adaptive homework generated',
    detail: `${assignment.problems.length} problems focused on ${assignment.focusSkillIds
      .map((skillId) => getSkill(skillId).name)
      .join(', ')}.`,
  }

  return {
    ...learner,
    activityLog: [event, ...learner.activityLog].slice(0, 16),
  }
}

export const logDownload = (learner: Learner, assignment: Assignment): Learner => {
  const event: ActivityEvent = {
    id: `A-${shortId(`${assignment.id}-download`)}`,
    date: todayIso(),
    type: 'download',
    title: 'Homework downloaded',
    detail: `${assignment.title} exported as an HTML handout.`,
  }

  return {
    ...learner,
    activityLog: [event, ...learner.activityLog].slice(0, 16),
  }
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

export const assignmentToHtml = (assignment: Assignment, learner: Learner) => {
  const focusList = assignment.focusSkillIds
    .map((skillId) => `<li>${escapeHtml(getSkill(skillId).name)}</li>`)
    .join('')
  const problems = assignment.problems
    .map(
      (problem, index) => `<li>
        <h2>Problem ${index + 1}: ${escapeHtml(getSkill(problem.skillId).name)}</h2>
        <p>${escapeHtml(problem.prompt)}</p>
        <p><strong>Hint:</strong> ${escapeHtml(problem.hint)}</p>
        <p><strong>Checks for:</strong> ${escapeHtml(problem.checksFor)}</p>
      </li>`,
    )
    .join('')
  const answerKey = assignment.problems
    .map(
      (problem, index) => `<li>
        <strong>Problem ${index + 1}:</strong> ${escapeHtml(problem.solution)}
      </li>`,
    )
    .join('')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(assignment.title)}</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; color: #17211f; line-height: 1.5; margin: 40px; }
    h1 { font-size: 28px; margin-bottom: 4px; }
    h2 { font-size: 18px; margin-bottom: 4px; }
    .meta { color: #5b6461; margin-bottom: 24px; }
    li { margin-bottom: 18px; }
    .answer-key { break-before: page; margin-top: 48px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(assignment.title)}</h1>
  <p class="meta">Learner: ${escapeHtml(learner.name)} | Created: ${new Date(
    assignment.createdAt,
  ).toLocaleDateString()} | Due: ${new Date(assignment.dueAt).toLocaleDateString()}</p>
  <h2>Focus Skills</h2>
  <ul>${focusList}</ul>
  <h2>Problems</h2>
  <ol>${problems}</ol>
  <section class="answer-key">
    <h2>Answer Key</h2>
    <ol>${answerKey}</ol>
  </section>
</body>
</html>`
}
