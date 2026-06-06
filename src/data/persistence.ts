import type { Assignment, Learner, MistakeEvent } from './learningModel'
import type { MisconceptionCategoryId } from './pedagogy'

const STORAGE_KEY = 'linear-algebra-training-studio:v1'

export type TrainingSnapshot = {
  version: 1
  savedAt: string
  learners: Learner[]
  assignments: Record<string, Assignment>
}

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const createTrainingSnapshot = (
  learners: Learner[],
  assignments: Record<string, Assignment>,
): TrainingSnapshot => ({
  version: 1,
  savedAt: new Date().toISOString(),
  learners,
  assignments,
})

const normalizeMistake = (mistake: Partial<MistakeEvent>): MistakeEvent => ({
  id: mistake.id ?? `M-${Date.now()}`,
  date: mistake.date ?? new Date().toISOString(),
  skillId: mistake.skillId ?? 'vec-combinations',
  categoryId:
    mistake.categoryId ?? ('concept-mismatch' satisfies MisconceptionCategoryId),
  problem: mistake.problem ?? 'Unknown problem',
  misconception: mistake.misconception ?? 'Unknown',
  learnerAnswer: mistake.learnerAnswer ?? 'No learner answer recorded.',
  correction: mistake.correction ?? 'Review the related skill.',
  severity: mistake.severity ?? 'medium',
  status: mistake.status ?? 'open',
})

const normalizeLearners = (
  learners: Partial<Learner>[],
  fallbackLearners: Learner[],
): Learner[] =>
  learners.map((learner, index) => {
    const fallback =
      fallbackLearners.find((candidate) => candidate.id === learner.id) ??
      fallbackLearners[index] ??
      fallbackLearners[0]
    return {
      ...fallback,
      ...learner,
      skills: {
        ...fallback.skills,
        ...(learner.skills ?? {}),
      },
      mistakeLog: (learner.mistakeLog ?? fallback.mistakeLog).map(normalizeMistake),
      activityLog: learner.activityLog ?? fallback.activityLog,
      attemptLog: learner.attemptLog ?? fallback.attemptLog,
    }
  })

const assignmentHasCurrentProblemShape = (assignment: Assignment) =>
  assignment.problems.every(
    (problem) =>
      'templateId' in problem &&
      'rubricId' in problem &&
      'misconceptionCategoryId' in problem &&
      'estimatedMinutes' in problem,
  )

const normalizeAssignments = (
  assignments: Record<string, Assignment>,
  fallbackAssignments: Record<string, Assignment>,
) =>
  Object.fromEntries(
    Object.entries(fallbackAssignments).map(([learnerId, fallbackAssignment]) => {
      const assignment = assignments[learnerId]
      return [
        learnerId,
        assignment && assignmentHasCurrentProblemShape(assignment)
          ? assignment
          : fallbackAssignment,
      ]
    }),
  ) as Record<string, Assignment>

export const loadTrainingSnapshot = (
  fallbackLearners: Learner[],
  fallbackAssignments: Record<string, Assignment>,
): TrainingSnapshot => {
  if (!canUseStorage()) {
    return createTrainingSnapshot(fallbackLearners, fallbackAssignments)
  }

  const rawSnapshot = window.localStorage.getItem(STORAGE_KEY)
  if (!rawSnapshot) {
    return createTrainingSnapshot(fallbackLearners, fallbackAssignments)
  }

  try {
    const parsed = JSON.parse(rawSnapshot) as Partial<TrainingSnapshot>
    if (
      parsed.version !== 1 ||
      !Array.isArray(parsed.learners) ||
      typeof parsed.assignments !== 'object' ||
      parsed.assignments === null
    ) {
      return createTrainingSnapshot(fallbackLearners, fallbackAssignments)
    }

    return {
      version: 1,
      savedAt: parsed.savedAt ?? new Date().toISOString(),
      learners: normalizeLearners(parsed.learners, fallbackLearners),
      assignments: normalizeAssignments(
        parsed.assignments as Record<string, Assignment>,
        fallbackAssignments,
      ),
    }
  } catch {
    return createTrainingSnapshot(fallbackLearners, fallbackAssignments)
  }
}

export const saveTrainingSnapshot = (
  learners: Learner[],
  assignments: Record<string, Assignment>,
) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(createTrainingSnapshot(learners, assignments)),
  )
}

export const clearTrainingSnapshot = () => {
  if (!canUseStorage()) return
  window.localStorage.removeItem(STORAGE_KEY)
}
