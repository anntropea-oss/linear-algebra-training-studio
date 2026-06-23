import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  CircleDot,
  Flame,
  Lightbulb,
  ListChecks,
  Plus,
  RefreshCcw,
  RotateCcw,
  Target,
  TriangleAlert,
} from 'lucide-react'
import './App.css'
import {
  addProblemSet,
  applyDiagnosticPlacement,
  conceptSequenceFrom,
  concepts,
  createGuidedSolution,
  diagnosticQuestions,
  evaluateLessonChecks,
  evaluateResponse,
  evaluateWorkSteps,
  getActiveSet,
  getConcept,
  getLesson,
  getLessonChecks,
  getNextProblemInSet,
  getPrerequisiteStatus,
  getWorkStepTargets,
  markLessonRead,
  orderChoices,
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
  const [workStepDrafts, setWorkStepDrafts] = useState<Record<string, string[]>>({})
  const [hintLevels, setHintLevels] = useState<Record<string, number>>({})
  const [guideLevels, setGuideLevels] = useState<Record<string, number>>({})
  const [diagnosticResponses, setDiagnosticResponses] = useState<Record<string, string>>(
    profile.diagnostic?.responses ?? {},
  )
  const [lessonCheckAnswers, setLessonCheckAnswers] = useState<
    Record<string, string>
  >({})
  const [lessonTryItDrafts, setLessonTryItDrafts] = useState<Record<string, string>>(
    {},
  )
  const [lessonTryItChecks, setLessonTryItChecks] = useState<Record<string, boolean>>(
    {},
  )
  const [lessonTryItHints, setLessonTryItHints] = useState<Record<string, boolean>>(
    {},
  )
  const activeSet = getActiveSet(profile, selectedSetId)
  const activeConcept = getConcept(activeSet.conceptId)
  const activeLesson = getLesson(activeSet.conceptId)
  const activeLessonChecks = getLessonChecks(activeSet.conceptId)
  const savedLessonCheck = profile.lessonCheckRecords?.[activeSet.conceptId]
  const lessonCheckResponses = Object.fromEntries(
    activeLessonChecks.map((check) => [
      check.id,
      lessonCheckAnswers[`${activeSet.conceptId}:${check.id}`] ??
        savedLessonCheck?.responses[check.id] ??
        '',
    ]),
  )
  const lessonCheckResult = evaluateLessonChecks(
    activeSet.conceptId,
    lessonCheckResponses,
  )
  const prerequisiteStatus = getPrerequisiteStatus(profile, activeSet.conceptId)
  const lessonRead = Boolean(profile.lessonReads?.[activeSet.conceptId])
  const lessonTryItDraft = lessonTryItDrafts[activeSet.conceptId] ?? ''
  const lessonTryItChecked = lessonTryItChecks[activeSet.conceptId] ?? false
  const lessonTryItFeedback = evaluateResponse(activeLesson.tryIt, lessonTryItDraft)
  const lessonTryItPassed =
    lessonTryItChecked && lessonTryItFeedback.tone === 'correct'
  const diagnosticComplete = diagnosticQuestions.every(
    (question) => diagnosticResponses[question.id],
  )
  const activeProblem = getNextProblemInSet(activeSet)
  const activeProgress = setCompletion(activeSet)
  const currentProgress = activeSet.progress[activeProblem.id]
  const draftAnswer = drafts[activeProblem.id] ?? currentProgress?.response ?? ''
  const workStepTargets = getWorkStepTargets(activeProblem)
  const currentWorkSteps = workStepTargets.map(
    (_, index) =>
      workStepDrafts[activeProblem.id]?.[index] ??
      currentProgress?.workSteps?.[index] ??
      '',
  )
  const hintLevel = hintLevels[activeProblem.id] ?? currentProgress?.hintsUsed ?? 0
  const guideLevel =
    guideLevels[activeProblem.id] ?? currentProgress?.guideStepsUsed ?? 0
  const liveFeedback = evaluateResponse(activeProblem, draftAnswer)
  const workStepReport = evaluateWorkSteps(activeProblem, currentWorkSteps)
  const guidedSolution = createGuidedSolution(
    activeProblem,
    draftAnswer,
    guideLevel,
  )
  const recommendedConcept = activeConcept
  const path = conceptSequenceFrom(activeSet.conceptId).slice(0, 5)
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
    setWorkStepDrafts({})
    setHintLevels({})
    setGuideLevels({})
    setDiagnosticResponses(nextProfile.diagnostic?.responses ?? {})
    setLessonCheckAnswers({})
    setLessonTryItDrafts({})
    setLessonTryItChecks({})
    setLessonTryItHints({})
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
      {
        hintsUsed: hintLevel,
        guideStepsUsed: guideLevel,
        workSteps: currentWorkSteps,
      },
    )
    const nextSet = getActiveSet(nextProfile, activeSet.id)
    setProfile(nextProfile)
    setSelectedSetId(nextSet.id)
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [activeProblem.id]: '',
    }))
    setWorkStepDrafts((currentDrafts) => ({
      ...currentDrafts,
      [activeProblem.id]: [],
    }))
    setHintLevels((currentLevels) => ({
      ...currentLevels,
      [activeProblem.id]: 0,
    }))
    setGuideLevels((currentLevels) => ({
      ...currentLevels,
      [activeProblem.id]: 0,
    }))
  }

  const handleRevealGuideStep = () => {
    setGuideLevels((currentLevels) => ({
      ...currentLevels,
      [activeProblem.id]: Math.min(
        guidedSolution.steps.length,
        (currentLevels[activeProblem.id] ?? currentProgress?.guideStepsUsed ?? 0) +
          1,
      ),
    }))
  }

  const handleMarkLessonRead = () => {
    if (!lessonTryItPassed || !lessonCheckResult.passed) return
    const profileWithTryIt = activeSet.problemIds.includes(activeLesson.tryIt.id)
      ? submitResponse(
          profile,
          activeSet.id,
          activeLesson.tryIt.id,
          lessonTryItDraft,
        )
      : profile
    setProfile(
      markLessonRead(
        profileWithTryIt,
        activeSet.conceptId,
        lessonCheckResponses,
      ),
    )
  }

  const handleDiagnosticSubmit = () => {
    if (!diagnosticComplete) return
    const nextProfile = applyDiagnosticPlacement(profile, diagnosticResponses)
    setProfile(nextProfile)
    setSelectedStart(nextProfile.startingPoint)
    setSelectedSetId(nextProfile.problemSets[0]?.id)
    setDrafts({})
    setWorkStepDrafts({})
    setHintLevels({})
    setGuideLevels({})
    setLessonCheckAnswers({})
    setLessonTryItDrafts({})
    setLessonTryItChecks({})
    setLessonTryItHints({})
  }

  return (
    <div className="app-shell">
      <aside className="rail">
        <div className="brand">
          <span className="brand-icon">
            <span className="brand-mark">LA</span>
          </span>
          <div className="brand-wordmark">
            <h1>L.A. Studio</h1>
            <p>linear algebra</p>
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

        <section className="lesson-stage">
          <div className="lesson-stage-heading">
            <div>
              <p className="eyebrow">Learn first</p>
              <h2>{activeConcept.title}</h2>
              <p>{activeLesson.whyItMatters}</p>
            </div>
            <span className={`lesson-status ${lessonRead ? 'completed' : 'active'}`}>
              {lessonRead ? 'lesson complete' : 'lesson in progress'}
            </span>
          </div>

          <div className="lesson-intro">
            <BookOpen size={24} />
            <div>
              <p className="eyebrow">The central idea</p>
              <h3>{activeLesson.bigIdea}</h3>
            </div>
          </div>

          <div className="lecture-flow">
            {activeLesson.lecture.map((section, index) => (
              <article key={section.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{section.title}</h3>
                  <p>{section.explanation}</p>
                  <div className="lecture-connection">
                    <strong>Why this leads forward</strong>
                    <p>{section.connection}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="lesson-block">
            <div className="lesson-block-heading">
              <p className="eyebrow">Vocabulary</p>
              <h3>Terms you need before calculating</h3>
            </div>
            <div className="definition-grid">
              {activeLesson.definitions.map((definition) => (
                <div key={definition.term}>
                  <strong>{definition.term}</strong>
                  <p>{definition.meaning}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="lesson-block">
            <div className="lesson-block-heading">
              <p className="eyebrow">Watch the reasoning</p>
              <h3>Two worked examples</h3>
            </div>
            <div className="worked-example-grid">
              {activeLesson.workedExamples.map((example) => (
                <article className="worked-example" key={example.title}>
                  <h4>{example.title}</h4>
                  <strong>{example.prompt}</strong>
                  <ol>
                    {example.steps.map((step, index) => (
                      <li key={`${example.title}-${index}`}>
                        <strong>{step.action}</strong>
                        <p>
                          <b>Why this step:</b> {step.why}
                        </p>
                      </li>
                    ))}
                  </ol>
                  <p className="example-takeaway">{example.takeaway}</p>
                </article>
              ))}
            </div>
          </section>

          {!lessonRead ? (
            <>
              <section className="try-it-tool">
                <div className="lesson-block-heading">
                  <p className="eyebrow">Try it yourself</p>
                  <h3>Use the method before the problem set</h3>
                </div>
                <div className="try-it-context">
                  <strong>Recall from the lecture</strong>
                  <p>{activeLesson.theory[0]}</p>
                </div>
                <strong className="try-it-prompt">{activeLesson.tryIt.prompt}</strong>
                <label className="answer-field">
                  <span>Show your answer or reasoning</span>
                  <textarea
                    aria-label="Try it yourself answer"
                    onChange={(event) => {
                      setLessonTryItDrafts((currentDrafts) => ({
                        ...currentDrafts,
                        [activeSet.conceptId]: event.target.value,
                      }))
                      setLessonTryItChecks((currentChecks) => ({
                        ...currentChecks,
                        [activeSet.conceptId]: false,
                      }))
                    }}
                    placeholder="Work the example in your own words"
                    value={lessonTryItDraft}
                  />
                </label>
                <div className="problem-actions">
                  <button
                    onClick={() =>
                      setLessonTryItHints((currentHints) => ({
                        ...currentHints,
                        [activeSet.conceptId]: true,
                      }))
                    }
                    type="button"
                  >
                    <Lightbulb size={17} />
                    Need a starting hint
                  </button>
                  <button
                    className="primary"
                    disabled={!lessonTryItDraft.trim()}
                    onClick={() =>
                      setLessonTryItChecks((currentChecks) => ({
                        ...currentChecks,
                        [activeSet.conceptId]: true,
                      }))
                    }
                    type="button"
                  >
                    <CheckCircle2 size={17} />
                    Check my try
                  </button>
                </div>
                {lessonTryItHints[activeSet.conceptId] ? (
                  <div className="hint-box">
                    <strong>Start here</strong>
                    <p>{activeLesson.tryIt.hint}</p>
                    <span>{activeLesson.tryIt.deeperHint}</span>
                  </div>
                ) : null}
                {lessonTryItChecked ? (
                  <div
                    className={`try-it-feedback ${
                      lessonTryItPassed ? 'correct' : 'needs-work'
                    }`}
                  >
                    <strong>{lessonTryItFeedback.headline}</strong>
                    <p>{lessonTryItFeedback.detail}</p>
                    <div>
                      <b>Why this is the next move</b>
                      <span>{lessonTryItFeedback.nextAction}</span>
                    </div>
                    {lessonTryItPassed ? (
                      <ol>
                        {activeLesson.tryIt.solutionSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    ) : null}
                  </div>
                ) : null}
              </section>

              <section className="lesson-check-panel">
                <div className="lesson-block-heading">
                  <p className="eyebrow">Check your understanding</p>
                  <h3>
                    {lessonTryItPassed
                      ? 'Confirm the ideas, not the answer position'
                      : 'Complete the try-it problem to unlock these checks'}
                  </h3>
                </div>
                {lessonCheckResult.results.map((result) => (
                  <div className="lesson-check-question" key={result.check.id}>
                    <strong>{result.check.prompt}</strong>
                    <div className="choice-row">
                      {orderChoices(result.check.id, result.check.choices).map(
                        (choice) => (
                          <button
                            className={
                              result.selectedChoiceId === choice.id ? 'selected' : ''
                            }
                            disabled={!lessonTryItPassed}
                            key={choice.id}
                            onClick={() =>
                              setLessonCheckAnswers((currentAnswers) => ({
                                ...currentAnswers,
                                [`${activeSet.conceptId}:${result.check.id}`]:
                                  choice.id,
                              }))
                            }
                            type="button"
                          >
                            {choice.label}
                          </button>
                        ),
                      )}
                    </div>
                    {result.selectedChoiceId ? (
                      <p
                        className={
                          result.correct ? 'choice-feedback correct' : 'choice-feedback'
                        }
                      >
                        {result.correct
                          ? result.check.correctFeedback
                          : result.check.incorrectFeedback}
                      </p>
                    ) : null}
                  </div>
                ))}
                <button
                  className="primary"
                  disabled={!lessonTryItPassed || !lessonCheckResult.passed}
                  onClick={handleMarkLessonRead}
                  type="button"
                >
                  <CheckCircle2 size={17} />
                  Unlock problem set
                </button>
              </section>
            </>
          ) : (
            <div className="lesson-complete-banner">
              <CheckCircle2 size={18} />
              <div>
                <strong>Lecture and readiness work complete</strong>
                <p>The problem set below now applies this same reasoning.</p>
              </div>
            </div>
          )}
        </section>

        <section className="panel diagnostic-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Placement diagnostic</p>
              <h2>
                {profile.diagnostic
                  ? `${profile.diagnostic.score}/${profile.diagnostic.total} placement`
                  : 'Find the right starting point'}
              </h2>
            </div>
            <Target size={18} />
          </div>
          <div className="diagnostic-grid">
            {diagnosticQuestions.map((question) => {
              const selected = diagnosticResponses[question.id]
              const correct = selected === question.correctChoiceId
              return (
                <div className="diagnostic-question" key={question.id}>
                  <span>{getConcept(question.conceptId).shortTitle}</span>
                  <strong>{question.prompt}</strong>
                  <div className="choice-row">
                    {orderChoices(question.id, question.choices).map((choice) => (
                      <button
                        className={selected === choice.id ? 'selected' : ''}
                        key={choice.id}
                        onClick={() =>
                          setDiagnosticResponses((currentResponses) => ({
                            ...currentResponses,
                            [question.id]: choice.id,
                          }))
                        }
                        type="button"
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                  {selected ? (
                    <p className={correct ? 'choice-feedback correct' : 'choice-feedback'}>
                      {correct ? 'Ready.' : question.feedback}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
          <div className="diagnostic-actions">
            <button
              className="primary"
              disabled={!diagnosticComplete}
              onClick={handleDiagnosticSubmit}
              type="button"
            >
              <CheckCircle2 size={17} />
              Apply placement
            </button>
            {profile.diagnostic ? (
              <p>
                Recommended start:{' '}
                <strong>{getConcept(profile.diagnostic.recommendedStart).title}</strong>
              </p>
            ) : (
              <p>Answer every item to let the app place you before practice.</p>
            )}
          </div>
        </section>

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
                    {set.repairFocus ? <span>{set.repairFocus.label}</span> : null}
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

            {!lessonRead ? (
              <div className="practice-locked">
                <BookOpen size={22} />
                <div>
                  <p className="eyebrow">Practice locked</p>
                  <h3>Finish the learning sequence above</h3>
                  <p>
                    The try-it problem and concept checks make sure the problem set
                    starts with enough understanding to be useful.
                  </p>
                </div>
              </div>
            ) : (
              <div className="problem-card">
                <div className="problem-meta">
                  <span>{getConcept(activeProblem.conceptId).shortTitle}</span>
                  <span>Problem {activeSet.problemIds.indexOf(activeProblem.id) + 1}</span>
                  <span>{activeProgress.percent}% set complete</span>
                  <span>Lesson complete</span>
                  {activeSet.repairFocus ? (
                    <span>Repair: {activeSet.repairFocus.label}</span>
                  ) : null}
                  {activeProblem.repairOnly ? <span>Repair variant</span> : null}
                  {guideLevel > 0 ? (
                    <span>
                      AI guide {guideLevel}/{guidedSolution.steps.length}
                    </span>
                  ) : null}
                </div>
                <h3>{activeProblem.prompt}</h3>
                <div className="problem-recall">
                  <strong>Bring this idea from the lecture</strong>
                  <p>{activeLesson.theory[0]}</p>
                  <span>What your work should show: {activeProblem.checksFor}</span>
                </div>
                <section className="work-step-panel">
                  <div className="work-step-heading">
                    <div>
                      <p className="eyebrow">Work path</p>
                      <h4>{workStepReport.headline}</h4>
                    </div>
                    <span>
                      {workStepReport.onTrack}/{workStepReport.total}
                    </span>
                  </div>
                  <div className="work-step-list">
                    {workStepReport.feedback.map((step) => (
                      <label
                        className={`work-step-row ${step.status}`}
                        key={`${activeProblem.id}-step-${step.index}`}
                      >
                        <span className="work-step-number">{step.index + 1}</span>
                        <textarea
                          aria-label={`Work step ${step.index + 1}`}
                          className="work-step-input"
                          onChange={(event) =>
                            setWorkStepDrafts((currentDrafts) => {
                              const existing =
                                currentDrafts[activeProblem.id] ??
                                currentProgress?.workSteps ??
                                []
                              const nextSteps = [...existing]
                              nextSteps[step.index] = event.target.value
                              return {
                                ...currentDrafts,
                                [activeProblem.id]: nextSteps,
                              }
                            })
                          }
                          placeholder={`Step ${step.index + 1}`}
                          value={currentWorkSteps[step.index] ?? ''}
                        />
                        <span className="work-step-feedback">{step.detail}</span>
                      </label>
                    ))}
                  </div>
                </section>
                <label className="answer-field">
                  <span>Final answer</span>
                  <textarea
                    aria-label="Final answer"
                    onChange={(event) =>
                      setDrafts((currentDrafts) => ({
                        ...currentDrafts,
                        [activeProblem.id]: event.target.value,
                      }))
                    }
                    placeholder="Answer"
                    value={draftAnswer}
                  />
                </label>
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
                  <button onClick={handleRevealGuideStep} type="button">
                    <Brain size={17} />
                    I don't know yet
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
            )}
          </article>

          <aside className="coach-column">
            {lessonRead ? (
              <>
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

                <section className="panel coach-panel working">
                  <div className="panel-heading">
                    <div>
                      <p className="eyebrow">Step coach</p>
                      <h2>{workStepReport.headline}</h2>
                    </div>
                    <ListChecks size={18} />
                  </div>
                  <p>{workStepReport.detail}</p>
                  <div className="next-action">
                    <strong>Next step</strong>
                    <span>{workStepReport.nextAction}</span>
                  </div>
                  <div className="step-feedback-list">
                    {workStepReport.feedback.map((step) => (
                      <div className={step.status} key={`${step.index}-${step.status}`}>
                        <strong>Step {step.index + 1}</strong>
                        <span>{step.status.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel solution-panel guide-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="eyebrow">AI guide</p>
                      <h2>{guidedSolution.headline}</h2>
                    </div>
                    <Brain size={18} />
                  </div>
                  <div className="guide-nudge">
                    <strong>Coach nudge</strong>
                    <span>{guidedSolution.nudge}</span>
                  </div>
                  {guidedSolution.revealedSteps.length ? (
                    <ol className="guide-steps">
                      {guidedSolution.revealedSteps.map((step) => (
                        <li key={step.id}>
                          <strong>{step.title}</strong>
                          <p>{step.coachPrompt}</p>
                          <div className="guide-support">
                            <b>What to use</b>
                            <span>{step.support}</span>
                          </div>
                          <div className="guide-why">
                            <b>Why this step</b>
                            <span>{step.why}</span>
                          </div>
                          <div className="guide-reveal">
                            <b>Reveal</b>
                            <span>{step.reveal}</span>
                          </div>
                          <em>{step.check}</em>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="muted">
                      Stuck is useful evidence. Start with the smallest next move.
                    </p>
                  )}
                  <button
                    className={guidedSolution.completed ? '' : 'primary'}
                    disabled={guidedSolution.completed}
                    onClick={handleRevealGuideStep}
                    type="button"
                  >
                    <Brain size={17} />
                    {guidedSolution.completed ? 'Guide complete' : 'Next guided step'}
                  </button>
                </section>
              </>
            ) : (
              <>
                <section className="panel coach-panel working">
                  <div className="panel-heading">
                    <div>
                      <p className="eyebrow">Learning coach</p>
                      <h2>Build the model first</h2>
                    </div>
                    <BookOpen size={18} />
                  </div>
                  <p>
                    Read the theory, vocabulary, and worked example before opening
                    the problem workspace.
                  </p>
                  <div className="next-action">
                    <strong>Next move</strong>
                    <span>Explain the big idea in your own words, then start practice.</span>
                  </div>
                </section>

                <section className="panel solution-panel guide-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="eyebrow">Readiness</p>
                      <h2>Before practice</h2>
                    </div>
                  </div>
                  <ul className="lesson-checklist">
                    {activeLesson.readinessChecks.map((check) => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            <section className="panel prerequisite-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Prerequisites</p>
                  <h2>
                    {prerequisiteStatus.length ? 'Readiness map' : 'Foundation concept'}
                  </h2>
                </div>
                <Target size={18} />
              </div>
              {prerequisiteStatus.length ? (
                <div className="prerequisite-list">
                  {prerequisiteStatus.map((status) => (
                    <div
                      className={status.ready ? 'ready' : 'needs-work'}
                      key={status.conceptId}
                    >
                      <strong>{status.title}</strong>
                      <span>{status.mastery}% mastery</span>
                      <span>
                        {status.lessonComplete ? 'lesson complete' : 'lesson needed'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">This is the first layer of the course.</p>
              )}
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
                  {nextRepair.evidence ? (
                    <span>
                      Evidence: {nextRepair.source === 'work-step' ? 'step ' : ''}
                      {nextRepair.source === 'work-step' && nextRepair.stepIndex !== undefined
                        ? `${nextRepair.stepIndex + 1}: `
                        : ''}
                      {nextRepair.evidence}
                    </span>
                  ) : null}
                  <strong>{nextRepair.repair}</strong>
                  <button onClick={() => handleAddSet('repair')} type="button">
                    <RotateCcw size={17} />
                    Create targeted repair
                  </button>
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
