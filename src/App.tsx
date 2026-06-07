import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  CircleDot,
  Flame,
  Lightbulb,
  Plus,
  RefreshCcw,
  RotateCcw,
  Target,
  TriangleAlert,
} from 'lucide-react'
import './App.css'
import {
  addProblemSet,
  conceptSequenceFrom,
  concepts,
  evaluateResponse,
  getActiveSet,
  getConcept,
  getNextProblemInSet,
  overallMastery,
  resolveMistake,
  setCompletion,
  submitResponse,
} from './domain/tutorEngine'
import type { ConceptId, LearnerProfile, SetMode } from './domain/tutorEngine'
import { loadProfile, resetProfile, saveProfile } from './domain/storage'

type MeterStyle = CSSProperties & {
  '--value': string
}

const startOptions: Array<{
  id: ConceptId
  label: string
  detail: string
}> = [
  {
    id: 'vectors',
    label: 'Brand new',
    detail: 'Start with vectors, coordinates, and combinations.',
  },
  {
    id: 'systems',
    label: 'I can solve equations',
    detail: 'Begin with systems, rows, and pivots.',
  },
  {
    id: 'matrix-transformations',
    label: 'I know matrices',
    detail: 'Work on transformations and structure.',
  },
  {
    id: 'eigenvalues',
    label: 'Advanced review',
    detail: 'Jump into eigenvectors and spectral ideas.',
  },
]

const formatTime = (value: string) =>
  new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))

const masteryStatus = (value: number) => {
  if (value >= 80) return 'secure'
  if (value >= 60) return 'growing'
  if (value >= 40) return 'fragile'
  return 'repair'
}

const App = () => {
  const [profile, setProfile] = useState<LearnerProfile>(() => loadProfile())
  const [selectedStart, setSelectedStart] = useState<ConceptId>(
    profile.startingPoint,
  )
  const [selectedSetId, setSelectedSetId] = useState<string | undefined>(
    profile.problemSets[0]?.id,
  )
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [hintLevels, setHintLevels] = useState<Record<string, number>>({})
  const activeSet = getActiveSet(profile, selectedSetId)
  const activeProblem = getNextProblemInSet(activeSet)
  const activeProgress = setCompletion(activeSet)
  const currentProgress = activeSet.progress[activeProblem.id]
  const draftAnswer = drafts[activeProblem.id] ?? currentProgress?.response ?? ''
  const hintLevel = hintLevels[activeProblem.id] ?? currentProgress?.hintsUsed ?? 0
  const liveFeedback = evaluateResponse(activeProblem, draftAnswer)
  const recommendedConcept = getConcept(profile.currentConceptId)
  const path = conceptSequenceFrom(profile.currentConceptId).slice(0, 5)
  const openMistakes = profile.mistakes.filter((mistake) => !mistake.resolved)
  const nextRepair = openMistakes[0]
  const currentMastery = overallMastery(profile)

  useEffect(() => {
    saveProfile(profile)
  }, [profile])

  const handleStartOver = () => {
    const nextProfile = resetProfile(selectedStart, profile.name)
    setProfile(nextProfile)
    setSelectedSetId(nextProfile.problemSets[0]?.id)
    setDrafts({})
    setHintLevels({})
  }

  const handleAddSet = (mode: SetMode) => {
    const nextProfile = addProblemSet(profile, mode)
    setProfile(nextProfile)
    setSelectedSetId(nextProfile.problemSets[0]?.id)
  }

  const handleSubmit = () => {
    const nextProfile = submitResponse(
      profile,
      activeSet.id,
      activeProblem.id,
      draftAnswer,
    )
    const nextSet = getActiveSet(nextProfile, activeSet.id)
    setProfile(nextProfile)
    setSelectedSetId(nextSet.id)
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [activeProblem.id]: '',
    }))
  }

  return (
    <div className="app-shell">
      <aside className="rail">
        <div className="brand">
          <span className="brand-icon">
            <Brain size={24} />
          </span>
          <div>
            <p className="eyebrow">Linear Algebra</p>
            <h1>Live Tutor</h1>
          </div>
        </div>

        <section className="panel start-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Starting point</p>
              <h2>Meet yourself where you are</h2>
            </div>
            <Target size={18} />
          </div>
          <div className="start-options">
            {startOptions.map((option) => (
              <button
                className={selectedStart === option.id ? 'selected' : ''}
                key={option.id}
                onClick={() => setSelectedStart(option.id)}
                type="button"
              >
                <strong>{option.label}</strong>
                <span>{option.detail}</span>
              </button>
            ))}
          </div>
          <button className="wide-button" onClick={handleStartOver} type="button">
            <RefreshCcw size={17} />
            Restart path
          </button>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Progress</p>
              <h2>{currentMastery}% overall</h2>
            </div>
            <Flame size={18} />
          </div>
          <div className="concept-stack">
            {concepts.map((concept) => {
              const value = profile.mastery[concept.id]
              return (
                <div className="concept-row" key={concept.id}>
                  <div>
                    <strong>{concept.shortTitle}</strong>
                    <span>{masteryStatus(value)}</span>
                  </div>
                  <div
                    className="meter"
                    style={{ '--value': `${value}%` } as MeterStyle}
                  >
                    <span />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </aside>

      <main className="workspace">
        <header className="hero-panel">
          <div>
            <p className="eyebrow">Now learning</p>
            <h2>{recommendedConcept.title}</h2>
            <p>{recommendedConcept.target}</p>
          </div>
          <div className="hero-stats">
            <div>
              <strong>{profile.mastery[recommendedConcept.id]}%</strong>
              <span>mastery</span>
            </div>
            <div>
              <strong>{profile.confidence[recommendedConcept.id]}%</strong>
              <span>confidence</span>
            </div>
            <div>
              <strong>{openMistakes.length}</strong>
              <span>open repairs</span>
            </div>
          </div>
        </header>

        <section className="path-strip">
          {path.map((concept, index) => (
            <div className="path-node" key={concept.id}>
              <span>{index + 1}</span>
              <strong>{concept.shortTitle}</strong>
            </div>
          ))}
        </section>

        <section className="main-grid">
          <article className="panel problem-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Active problem set</p>
                <h2>{activeSet.title}</h2>
              </div>
              <span className={`set-status ${activeSet.status}`}>{activeSet.status}</span>
            </div>

            <div className="set-switcher">
              {profile.problemSets.map((set) => {
                const completion = setCompletion(set)
                return (
                  <button
                    className={set.id === activeSet.id ? 'active' : ''}
                    key={set.id}
                    onClick={() => setSelectedSetId(set.id)}
                    type="button"
                  >
                    <strong>{set.title}</strong>
                    <span>
                      {completion.answered}/{completion.total} | {completion.percent}%
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="set-actions">
              <button onClick={() => handleAddSet('adaptive')} type="button">
                <Plus size={17} />
                Adaptive
              </button>
              <button onClick={() => handleAddSet('repair')} type="button">
                <RotateCcw size={17} />
                Repair
              </button>
              <button onClick={() => handleAddSet('challenge')} type="button">
                <ArrowRight size={17} />
                Challenge
              </button>
            </div>

            <div className="problem-card">
              <div className="problem-meta">
                <span>{getConcept(activeProblem.conceptId).shortTitle}</span>
                <span>Problem {activeSet.problemIds.indexOf(activeProblem.id) + 1}</span>
                <span>{activeProgress.percent}% set complete</span>
              </div>
              <h3>{activeProblem.prompt}</h3>
              <textarea
                aria-label="Answer"
                onChange={(event) =>
                  setDrafts((currentDrafts) => ({
                    ...currentDrafts,
                    [activeProblem.id]: event.target.value,
                  }))
                }
                placeholder="Work here. The coach responds as you type."
                value={draftAnswer}
              />
              <div className="problem-actions">
                <button
                  onClick={() =>
                    setHintLevels((currentLevels) => ({
                      ...currentLevels,
                      [activeProblem.id]: Math.min(
                        2,
                        (currentLevels[activeProblem.id] ?? 0) + 1,
                      ),
                    }))
                  }
                  type="button"
                >
                  <Lightbulb size={17} />
                  Hint
                </button>
                <button
                  className="primary"
                  disabled={!draftAnswer.trim() || activeSet.status === 'completed'}
                  onClick={handleSubmit}
                  type="button"
                >
                  <CheckCircle2 size={17} />
                  Submit
                </button>
              </div>
              {hintLevel > 0 ? (
                <div className="hint-box">
                  <strong>Hint {hintLevel}</strong>
                  <p>{hintLevel === 1 ? activeProblem.hint : activeProblem.deeperHint}</p>
                </div>
              ) : null}
            </div>
          </article>

          <aside className="coach-column">
            <section className={`panel coach-panel ${liveFeedback.tone}`}>
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Live coach</p>
                  <h2>{liveFeedback.headline}</h2>
                </div>
                {liveFeedback.tone === 'correct' ? (
                  <CheckCircle2 size={18} />
                ) : liveFeedback.tone === 'mistake' ? (
                  <TriangleAlert size={18} />
                ) : (
                  <CircleDot size={18} />
                )}
              </div>
              <p>{liveFeedback.detail}</p>
              <div className="next-action">
                <strong>Next move</strong>
                <span>{liveFeedback.nextAction}</span>
              </div>
            </section>

            <section className="panel solution-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Worked path</p>
                  <h2>Solution steps</h2>
                </div>
              </div>
              <ol>
                {activeProblem.solutionSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section className="panel repair-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Repair queue</p>
                  <h2>{nextRepair ? nextRepair.label : 'Clear'}</h2>
                </div>
                <TriangleAlert size={18} />
              </div>
              {nextRepair ? (
                <div className="repair-card">
                  <p>{nextRepair.feedback}</p>
                  <strong>{nextRepair.repair}</strong>
                  <button
                    onClick={() => setProfile(resolveMistake(profile, nextRepair.id))}
                    type="button"
                  >
                    Mark repaired
                  </button>
                </div>
              ) : (
                <p className="muted">No open repairs. Keep going.</p>
              )}
            </section>
          </aside>
        </section>

        <section className="bottom-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Recent attempts</p>
                <h2>Learning evidence</h2>
              </div>
              <Activity size={18} />
            </div>
            <div className="attempt-list">
              {profile.attempts.slice(0, 5).map((attempt) => (
                <div className="attempt-row" key={attempt.id}>
                  <span>{attempt.score}/5</span>
                  <div>
                    <strong>{getConcept(attempt.conceptId).shortTitle}</strong>
                    <p>{attempt.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Activity</p>
                <h2>Session record</h2>
              </div>
            </div>
            <div className="activity-list">
              {profile.activity.slice(0, 6).map((entry) => (
                <div key={entry.id}>
                  <strong>{entry.title}</strong>
                  <p>{entry.detail}</p>
                  <span>{formatTime(entry.createdAt)}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
