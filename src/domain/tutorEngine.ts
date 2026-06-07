export type ConceptId =
  | 'vectors'
  | 'span'
  | 'systems'
  | 'row-reduction'
  | 'matrix-transformations'
  | 'subspaces'
  | 'orthogonality'
  | 'eigenvalues'

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
  score: number
  hintsUsed: number
  submittedAt?: string
}

export type ProblemSet = {
  id: string
  title: string
  mode: SetMode
  conceptId: ConceptId
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
  score: number
  feedback: string
  mistakeLabel?: string
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
    id: 'subspaces',
    title: 'Subspaces, Basis, and Dimension',
    shortTitle: 'Subspaces',
    level: 3,
    prerequisites: ['span', 'row-reduction'],
    target: 'Verify subspaces and describe them with efficient bases.',
  },
  {
    id: 'orthogonality',
    title: 'Orthogonality and Projections',
    shortTitle: 'Projection',
    level: 4,
    prerequisites: ['vectors', 'subspaces'],
    target: 'Use dot products to measure perpendicularity and closest vectors.',
  },
  {
    id: 'eigenvalues',
    title: 'Eigenvalues and Eigenvectors',
    shortTitle: 'Eigen',
    level: 5,
    prerequisites: ['matrix-transformations', 'subspaces'],
    target: 'Find directions that stay on their own line under a transformation.',
  },
]

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
} satisfies Record<string, MistakePattern>

export const problemBank: Problem[] = [
  {
    id: 'vec-1',
    conceptId: 'vectors',
    prompt: 'Find a and b so that a(1, 2) + b(3, 1) = (7, 8).',
    answerType: 'vector',
    accepted: ['a=17/5,b=6/5', '17/5,6/5', 'a = 3.4, b = 1.2'],
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

export const getProblem = (problemId: string) =>
  problemBank.find((problem) => problem.id === problemId) ?? problemBank[0]

export const conceptSequenceFrom = (conceptId: ConceptId) => {
  const startIndex = Math.max(
    0,
    concepts.findIndex((concept) => concept.id === conceptId),
  )
  return concepts.slice(startIndex)
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
  const acceptedMatch = problem.accepted.some((accepted) => {
    const normalizedAccepted = normalize(accepted)
    return (
      normalized.includes(normalizedAccepted) ||
      compacted.includes(compact(accepted)) ||
      compact(accepted).includes(compacted)
    )
  })
  const mustIncludeMatch =
    !problem.mustInclude ||
    problem.mustInclude.every((token) => compacted.includes(compact(token)))

  if (acceptedMatch && mustIncludeMatch) {
    return {
      tone: 'correct',
      headline: 'That matches the target idea',
      detail: problem.checksFor,
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

  if (normalized.length > 18 || mustIncludeMatch) {
    return {
      tone: 'working',
      headline: 'Part of this is useful',
      detail: 'I can see relevant structure, but the answer is not complete yet.',
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

export const createProblemSet = (
  profile: LearnerProfile,
  mode: SetMode = 'adaptive',
  forcedConceptId?: ConceptId,
): ProblemSet => {
  const conceptId = forcedConceptId ?? recommendConcept(profile)
  const conceptProblems = byConcept(conceptId)
  const prerequisiteProblems = getConcept(conceptId).prerequisites.flatMap(byConcept)
  const reviewConcept = concepts
    .filter((concept) => profile.mastery[concept.id] < 75)
    .sort((left, right) => profile.mastery[left.id] - profile.mastery[right.id])[0]
  const reviewProblems = reviewConcept ? byConcept(reviewConcept.id) : []
  const source =
    mode === 'repair'
      ? [...prerequisiteProblems, ...conceptProblems]
      : mode === 'challenge'
        ? [...conceptProblems.filter((problem) => problem.difficulty >= 2), ...reviewProblems]
        : [...conceptProblems, ...reviewProblems, ...prerequisiteProblems]
  const uniqueProblems = Array.from(new Map(source.map((problem) => [problem.id, problem])).values())
    .slice(0, 5)
  const createdAt = nowIso()

  return {
    id: uid('set'),
    title: `${getConcept(conceptId).shortTitle} ${mode} set`,
    mode,
    conceptId,
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
          score: 0,
          hintsUsed: 0,
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

export const submitResponse = (
  profile: LearnerProfile,
  setId: string,
  problemId: string,
  response: string,
): LearnerProfile => {
  const problem = getProblem(problemId)
  const feedback = evaluateResponse(problem, response)
  const score = feedback.score
  const masteryDelta = feedback.tone === 'correct' ? 8 : score >= 3 ? 3 : -4
  const confidenceDelta = feedback.tone === 'correct' ? 6 : feedback.tone === 'mistake' ? -5 : 1
  const createdAt = nowIso()
  const attempt: Attempt = {
    id: uid('attempt'),
    problemId,
    conceptId: problem.conceptId,
    response,
    score,
    feedback: feedback.detail,
    mistakeLabel: feedback.mistake?.label,
    createdAt,
  }
  const mistake: MistakeRecord | null =
    feedback.tone === 'mistake' && feedback.mistake
      ? {
          id: uid('mistake'),
          conceptId: problem.conceptId,
          problemId,
          label: feedback.mistake.label,
          feedback: feedback.mistake.feedback,
          repair: feedback.mistake.repair,
          response,
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
        score,
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
        title: feedback.tone === 'correct' ? 'Problem solved' : 'Problem checked',
        detail: `${getConcept(problem.conceptId).shortTitle}: ${feedback.headline}`,
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
