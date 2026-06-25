import {
  concepts,
  createLearnerProfile,
  repairAdaptiveSetConceptDrift,
} from './tutorEngine'
import type { ConceptId, LearnerProfile, ProblemProgress } from './tutorEngine'

const STORAGE_KEY = 'linear-algebra-live-tutor:v1'

const canStore = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const normalizeProfile = (profile: LearnerProfile): LearnerProfile => {
  const fallback = createLearnerProfile(profile.startingPoint ?? 'vectors', profile.name)

  return repairAdaptiveSetConceptDrift({
    ...profile,
    mastery: Object.fromEntries(
      concepts.map((concept) => [
        concept.id,
        profile.mastery?.[concept.id] ?? fallback.mastery[concept.id],
      ]),
    ) as Record<ConceptId, number>,
    confidence: Object.fromEntries(
      concepts.map((concept) => [
        concept.id,
        profile.confidence?.[concept.id] ?? fallback.confidence[concept.id],
      ]),
    ) as Record<ConceptId, number>,
    lessonReads: profile.lessonReads ?? {},
    lessonCheckRecords: profile.lessonCheckRecords ?? {},
    problemSets: profile.problemSets.map((set) => ({
      ...set,
      progress: Object.fromEntries(
        Object.entries(set.progress).map(([problemId, progress]) => {
          const normalized = progress as ProblemProgress
          return [
            problemId,
            {
              ...normalized,
              workSteps: normalized.workSteps ?? [],
              hintsUsed: normalized.hintsUsed ?? 0,
              guideStepsUsed: normalized.guideStepsUsed ?? 0,
            },
          ]
        }),
      ),
    })),
    attempts: profile.attempts.map((attempt) => ({
      ...attempt,
      workSteps: attempt.workSteps ?? [],
      hintsUsed: attempt.hintsUsed ?? 0,
      guideStepsUsed: attempt.guideStepsUsed ?? 0,
    })),
  })
}

export const loadProfile = (): LearnerProfile => {
  if (!canStore()) return createLearnerProfile()
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return createLearnerProfile()

  try {
    const parsed = JSON.parse(raw) as LearnerProfile
    if (!parsed.mastery || !parsed.problemSets || !parsed.currentConceptId) {
      return createLearnerProfile()
    }
    return normalizeProfile(parsed)
  } catch {
    return createLearnerProfile()
  }
}

export const saveProfile = (profile: LearnerProfile) => {
  if (!canStore()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export const resetProfile = (startingPoint: ConceptId, name = 'Learner') => {
  const profile = createLearnerProfile(startingPoint, name)
  saveProfile(profile)
  return profile
}
