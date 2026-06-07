import { createLearnerProfile } from './tutorEngine'
import type { ConceptId, LearnerProfile } from './tutorEngine'

const STORAGE_KEY = 'linear-algebra-live-tutor:v1'

const canStore = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const loadProfile = (): LearnerProfile => {
  if (!canStore()) return createLearnerProfile()
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return createLearnerProfile()

  try {
    const parsed = JSON.parse(raw) as LearnerProfile
    if (!parsed.mastery || !parsed.problemSets || !parsed.currentConceptId) {
      return createLearnerProfile()
    }
    return parsed
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
