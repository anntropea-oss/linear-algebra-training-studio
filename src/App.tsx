import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Download,
  FileText,
  Flame,
  Gauge,
  LineChart,
  Plus,
  RotateCcw,
  Save,
  Target,
  TriangleAlert,
  Users,
} from 'lucide-react'
import './App.css'
import {
  assignmentToHtml,
  averageMastery,
  applyDiagnosticCheckpoint,
  buildCohortAnalytics,
  buildDiagnosticReport,
  generateAssignment,
  getSkill,
  initialLearners,
  logAssignment,
  logDownload,
  recordAssignmentAttempt,
  recordPracticeResult,
  skillCatalog,
  stageMastery,
  stageOrder,
  weakestSkills,
} from './data/learningModel'
import type {
  ActivityType,
  Assignment,
  Learner,
  Outcome,
  SkillId,
} from './data/learningModel'
import {
  clearTrainingSnapshot,
  loadTrainingSnapshot,
  saveTrainingSnapshot,
} from './data/persistence'
import { getMisconceptionCategory, getRubric } from './data/pedagogy'

const StageMasteryChart = lazy(() =>
  import('./components/Charts').then((module) => ({
    default: module.StageMasteryChart,
  })),
)
const MasteryRadarChart = lazy(() =>
  import('./components/Charts').then((module) => ({
    default: module.MasteryRadarChart,
  })),
)
const MiniTrendChart = lazy(() =>
  import('./components/Charts').then((module) => ({
    default: module.MiniTrendChart,
  })),
)

type ProgressStyle = CSSProperties & {
  '--bar': string
  '--accent': string
}

const buildInitialAssignments = (learners = initialLearners) =>
  Object.fromEntries(
    learners.map((learner) => [learner.id, generateAssignment(learner)]),
  ) as Record<string, Assignment>

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))

const masteryColor = (mastery: number) => {
  if (mastery >= 80) return '#0f766e'
  if (mastery >= 60) return '#2563eb'
  if (mastery >= 40) return '#b45309'
  return '#be123c'
}

const statusLabel = (mastery: number) => {
  if (mastery >= 85) return 'Secure'
  if (mastery >= 65) return 'Developing'
  if (mastery >= 45) return 'Fragile'
  return 'Needs repair'
}

const activityIcon = (type: ActivityType) => {
  if (type === 'assignment') return <FileText size={16} />
  if (type === 'mistake') return <TriangleAlert size={16} />
  if (type === 'download') return <Download size={16} />
  if (type === 'diagnostic') return <Gauge size={16} />
  if (type === 'submission') return <Save size={16} />
  if (type === 'reset') return <RotateCcw size={16} />
  return <CheckCircle2 size={16} />
}

const shortSkillName = (name: string) =>
  name
    .replace(' and ', ' + ')
    .replace('Linear ', '')
    .replace('Matrix ', '')
    .replace('Eigenvalues and eigenvectors', 'Eigen')
    .replace('Projections and least squares', 'Projections')

const App = () => {
  const initialSnapshot = useMemo(
    () => loadTrainingSnapshot(initialLearners, buildInitialAssignments()),
    [],
  )
  const [learners, setLearners] = useState<Learner[]>(initialSnapshot.learners)
  const [selectedLearnerId, setSelectedLearnerId] = useState(initialLearners[0].id)
  const [selectedSkillId, setSelectedSkillId] =
    useState<SkillId>('linear-independence')
  const [practiceNote, setPracticeNote] = useState('')
  const [assignments, setAssignments] = useState<Record<string, Assignment>>(
    initialSnapshot.assignments,
  )
  const [submissionAnswer, setSubmissionAnswer] = useState('')
  const [confidenceBefore, setConfidenceBefore] = useState(45)
  const [confidenceAfter, setConfidenceAfter] = useState(55)
  const [hintsUsed, setHintsUsed] = useState(0)

  const learner =
    learners.find((currentLearner) => currentLearner.id === selectedLearnerId) ??
    learners[0]
  const activeAssignment =
    assignments[learner.id] ?? generateAssignment(learner, new Date().toISOString())
  const activeProblem = activeAssignment.problems[0]
  const mastery = averageMastery(learner)
  const stageData = useMemo(() => stageMastery(learner), [learner])
  const weakSkills = useMemo(() => weakestSkills(learner, 3), [learner])
  const selectedSkill = getSkill(selectedSkillId)
  const diagnosticReport = useMemo(() => buildDiagnosticReport(learner), [learner])
  const cohortAnalytics = useMemo(() => buildCohortAnalytics(learners), [learners])
  const selectedRubric = getRubric(activeProblem.rubricId)
  const selectedMisconception = getMisconceptionCategory(
    activeProblem.misconceptionCategoryId,
  )
  const weeklyPercent = Math.min(
    100,
    Math.round((learner.minutesThisWeek / learner.weeklyGoalMinutes) * 100),
  )
  const reviewCount = skillCatalog.filter(
    (skill) => learner.skills[skill.id].mastery < 55,
  ).length
  const radarData = skillCatalog.map((skill) => ({
    skill: shortSkillName(skill.name),
    mastery: learner.skills[skill.id].mastery,
  }))
  const trendData = [...learner.activityLog]
    .slice(0, 7)
    .reverse()
    .map((entry, index) => ({
      name: formatDate(entry.date),
      score: Math.min(100, mastery - (6 - index) * 2 + index),
    }))

  useEffect(() => {
    saveTrainingSnapshot(learners, assignments)
  }, [learners, assignments])

  const updateLearner = (nextLearner: Learner) => {
    setLearners((currentLearners) =>
      currentLearners.map((currentLearner) =>
        currentLearner.id === nextLearner.id ? nextLearner : currentLearner,
      ),
    )
  }

  const handleGenerateAssignment = () => {
    const assignment = generateAssignment(learner, new Date().toISOString())
    setAssignments((currentAssignments) => ({
      ...currentAssignments,
      [learner.id]: assignment,
    }))
    updateLearner(logAssignment(learner, assignment))
  }

  const handleDownload = () => {
    const html = assignmentToHtml(activeAssignment, learner)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${learner.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}-${activeAssignment.id.toLowerCase()}.html`
    anchor.click()
    URL.revokeObjectURL(url)
    updateLearner(logDownload(learner, activeAssignment))
  }

  const handlePracticeResult = (outcome: Outcome) => {
    updateLearner(recordPracticeResult(learner, selectedSkillId, outcome, practiceNote))
    setPracticeNote('')
  }

  const handleDiagnosticCheckpoint = () => {
    updateLearner(applyDiagnosticCheckpoint(learner))
  }

  const handleSubmitAssignment = () => {
    updateLearner(
      recordAssignmentAttempt(
        learner,
        activeAssignment,
        activeProblem.id,
        submissionAnswer,
        confidenceBefore,
        confidenceAfter,
        hintsUsed,
      ),
    )
    setSubmissionAnswer('')
    setConfidenceBefore(45)
    setConfidenceAfter(55)
    setHintsUsed(0)
  }

  const handleResetLocalRecords = () => {
    clearTrainingSnapshot()
    const fallbackAssignments = buildInitialAssignments(initialLearners)
    setLearners(initialLearners)
    setAssignments(fallbackAssignments)
    setSelectedLearnerId(initialLearners[0].id)
  }

  return (
    <div className="app-shell">
      <aside className="side-panel" aria-label="Learner roster">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Brain size={24} />
          </div>
          <div>
            <p className="eyebrow">Linear Algebra</p>
            <h1>Training Studio</h1>
          </div>
        </div>

        <div className="learner-list">
          {learners.map((currentLearner) => {
            const currentMastery = averageMastery(currentLearner)
            const isActive = currentLearner.id === learner.id
            return (
              <button
                className={`learner-button ${isActive ? 'active' : ''}`}
                key={currentLearner.id}
                onClick={() => setSelectedLearnerId(currentLearner.id)}
                type="button"
              >
                <span
                  className="avatar"
                  style={{ background: currentLearner.avatarColor }}
                >
                  {currentLearner.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <span>
                  <strong>{currentLearner.name}</strong>
                  <small>
                    {currentLearner.levelName} | {currentMastery}% mastery
                  </small>
                </span>
              </button>
            )
          })}
        </div>

        <div className="instructor-brief">
          <div className="brief-row">
            <Users size={17} />
            <span>{learners.length} active learners</span>
          </div>
          <div className="brief-row">
            <Target size={17} />
            <span>{reviewCount} skills below target</span>
          </div>
          <div className="brief-row">
            <RotateCcw size={17} />
            <span>Spaced review queue enabled</span>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">{learner.cohort} cohort</p>
            <h2>{learner.name}</h2>
            <p className="header-subtitle">{learner.levelName}</p>
          </div>
          <div className="header-actions">
            <button type="button" onClick={handleDiagnosticCheckpoint}>
              <Gauge size={18} />
              Diagnostic
            </button>
            <button type="button" onClick={handleGenerateAssignment}>
              <Plus size={18} />
              Generate
            </button>
            <button className="primary" type="button" onClick={handleDownload}>
              <Download size={18} />
              Download
            </button>
            <button type="button" onClick={handleResetLocalRecords}>
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </header>

        <section className="metric-grid" aria-label="Learner summary">
          <article className="metric-panel">
            <Gauge size={20} />
            <span>Mastery</span>
            <strong>{mastery}%</strong>
          </article>
          <article className="metric-panel">
            <Flame size={20} />
            <span>Streak</span>
            <strong>{learner.streakDays} days</strong>
          </article>
          <article className="metric-panel">
            <BookOpen size={20} />
            <span>Weekly work</span>
            <strong>{weeklyPercent}%</strong>
          </article>
          <article className="metric-panel">
            <TriangleAlert size={20} />
            <span>Review queue</span>
            <strong>{reviewCount}</strong>
          </article>
        </section>

        <section className="insight-grid">
          <article className="tool-panel diagnostic-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Diagnostic engine</p>
                <h3>{diagnosticReport.placement}</h3>
              </div>
              <Gauge size={19} />
            </div>
            <div className="diagnostic-score">
              <strong>{diagnosticReport.score}%</strong>
              <span>placement evidence</span>
            </div>
            <div className="diagnostic-columns">
              <div>
                <span>Repair</span>
                <strong>{diagnosticReport.repairSkills.length}</strong>
              </div>
              <div>
                <span>Review</span>
                <strong>{diagnosticReport.reviewSkills.length}</strong>
              </div>
              <div>
                <span>Ready</span>
                <strong>{diagnosticReport.readySkills.length}</strong>
              </div>
            </div>
            <ul className="next-step-list">
              {diagnosticReport.nextSteps.slice(0, 3).map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>

          <article className="tool-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Instructor analytics</p>
                <h3>Cohort signals</h3>
              </div>
              <Users size={19} />
            </div>
            <div className="analytics-kpis">
              <div>
                <span>Avg mastery</span>
                <strong>{cohortAnalytics.averageMastery}%</strong>
              </div>
              <div>
                <span>Open mistakes</span>
                <strong>{cohortAnalytics.openMistakeCount}</strong>
              </div>
              <div>
                <span>Attempts</span>
                <strong>{cohortAnalytics.attemptCount}</strong>
              </div>
            </div>
            <div className="misconception-list">
              {cohortAnalytics.commonMisconceptions.slice(0, 4).map((item) => (
                <div key={item.categoryId}>
                  <strong>{item.label}</strong>
                  <span>{item.count} open</span>
                </div>
              ))}
            </div>
          </article>

          <article className="tool-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Rubric</p>
                <h3>{selectedRubric.name}</h3>
              </div>
              <Target size={19} />
            </div>
            <div className="rubric-list">
              {selectedRubric.criteria.map((criterion) => (
                <div key={criterion.id}>
                  <strong>
                    {criterion.label} ({criterion.points})
                  </strong>
                  <span>{criterion.evidence}</span>
                </div>
              ))}
            </div>
            <p className="rubric-note">{selectedRubric.partialCreditNotes}</p>
          </article>
        </section>

        <section className="analytics-grid">
          <article className="tool-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Mastery by stage</p>
                <h3>Concept map</h3>
              </div>
              <LineChart size={19} />
            </div>
            <div className="chart-frame">
              <Suspense fallback={<div className="chart-skeleton" />}>
                <StageMasteryChart data={stageData} />
              </Suspense>
            </div>
          </article>

          <article className="tool-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Skill coverage</p>
                <h3>Mastery radar</h3>
              </div>
              <Target size={19} />
            </div>
            <div className="chart-frame">
              <Suspense fallback={<div className="chart-skeleton" />}>
                <MasteryRadarChart data={radarData} />
              </Suspense>
            </div>
          </article>
        </section>

        <section className="assignment-grid">
          <article className="tool-panel assignment-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Active homework</p>
                <h3>{activeAssignment.title}</h3>
              </div>
              <FileText size={19} />
            </div>
            <div className="assignment-meta">
              <span>Due {formatDate(activeAssignment.dueAt)}</span>
              <span>{activeAssignment.estimatedMinutes} min</span>
              <span>{activeAssignment.problems.length} problems</span>
            </div>
            <div className="focus-list">
              {activeAssignment.focusSkillIds.map((skillId) => (
                <span key={skillId}>{getSkill(skillId).name}</span>
              ))}
            </div>
            <ol className="problem-list">
              {activeAssignment.problems.map((problem) => (
                <li key={problem.id}>
                  <strong>{getSkill(problem.skillId).name}</strong>
                  <p>{problem.prompt}</p>
                  <small>
                    {problem.transferType.replace('-', ' ')} |{' '}
                    {getMisconceptionCategory(problem.misconceptionCategoryId).label}
                  </small>
                </li>
              ))}
            </ol>

            <div className="submission-workbench">
              <div>
                <p className="eyebrow">Learner submission</p>
                <h4>{getSkill(activeProblem.skillId).name}</h4>
                <p>{activeProblem.prompt}</p>
                <small>
                  Hint focus: {activeProblem.hint} | Rubric: {selectedRubric.name}
                </small>
              </div>
              <label className="field-label" htmlFor="submission-answer">
                Answer
              </label>
              <textarea
                id="submission-answer"
                onChange={(event) => setSubmissionAnswer(event.target.value)}
                placeholder="Type the learner response or paste submitted work."
                value={submissionAnswer}
              />
              <div className="submission-controls">
                <label htmlFor="confidence-before">
                  Confidence before
                  <input
                    id="confidence-before"
                    max="100"
                    min="0"
                    onChange={(event) =>
                      setConfidenceBefore(Number(event.target.value))
                    }
                    type="number"
                    value={confidenceBefore}
                  />
                </label>
                <label htmlFor="confidence-after">
                  Confidence after
                  <input
                    id="confidence-after"
                    max="100"
                    min="0"
                    onChange={(event) => setConfidenceAfter(Number(event.target.value))}
                    type="number"
                    value={confidenceAfter}
                  />
                </label>
                <label htmlFor="hints-used">
                  Hints
                  <input
                    id="hints-used"
                    max="5"
                    min="0"
                    onChange={(event) => setHintsUsed(Number(event.target.value))}
                    type="number"
                    value={hintsUsed}
                  />
                </label>
              </div>
              <button
                className="primary"
                disabled={submissionAnswer.trim().length === 0}
                onClick={handleSubmitAssignment}
                type="button"
              >
                <Save size={18} />
                Submit evidence
              </button>
              <p className="rubric-note">
                Watch for {selectedMisconception.label.toLowerCase()}:{' '}
                {selectedMisconception.intervention}
              </p>
            </div>
          </article>

          <article className="tool-panel practice-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Practice logger</p>
                <h3>Record evidence</h3>
              </div>
              <CheckCircle2 size={19} />
            </div>
            <label className="field-label" htmlFor="skill-select">
              Skill
            </label>
            <select
              id="skill-select"
              onChange={(event) => setSelectedSkillId(event.target.value)}
              value={selectedSkillId}
            >
              {skillCatalog.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
            <label className="field-label" htmlFor="practice-note">
              Note
            </label>
            <textarea
              id="practice-note"
              onChange={(event) => setPracticeNote(event.target.value)}
              placeholder={`Evidence for ${selectedSkill.name}`}
              value={practiceNote}
            />
            <div className="practice-actions">
              <button
                className="success"
                onClick={() => handlePracticeResult('correct')}
                type="button"
              >
                <CheckCircle2 size={18} />
                Correct
              </button>
              <button
                className="warning"
                onClick={() => handlePracticeResult('mistake')}
                type="button"
              >
                <TriangleAlert size={18} />
                Mistake
              </button>
            </div>

            <div className="mini-trend">
              <Suspense fallback={<div className="chart-skeleton compact" />}>
                <MiniTrendChart data={trendData} />
              </Suspense>
            </div>
          </article>
        </section>

        <section className="skills-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Adaptive profile</p>
              <h3>Skill graph</h3>
            </div>
            <div className="weak-skill-strip">
              {weakSkills.map((skill) => (
                <span key={skill.id}>{skill.name}</span>
              ))}
            </div>
          </div>

          <div className="stage-columns">
            {stageOrder.map((stage) => (
              <article className="stage-column" key={stage}>
                <h4>{stage}</h4>
                {skillCatalog
                  .filter((skill) => skill.stage === stage)
                  .map((skill) => {
                    const state = learner.skills[skill.id]
                    const progressStyle: ProgressStyle = {
                      '--bar': `${state.mastery}%`,
                      '--accent': masteryColor(state.mastery),
                    }
                    return (
                      <div className="skill-card" key={skill.id}>
                        <div className="skill-card-top">
                          <strong>{skill.name}</strong>
                          <span>{statusLabel(state.mastery)}</span>
                        </div>
                        <div className="progress-track" style={progressStyle}>
                          <span />
                        </div>
                        <div className="skill-card-foot">
                          <span>{state.mastery}% mastery</span>
                          <span>{state.confidence}% confidence</span>
                        </div>
                      </div>
                    )
                  })}
              </article>
            ))}
          </div>
        </section>

        <section className="records-grid">
          <article className="tool-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Mistakes</p>
                <h3>Correction queue</h3>
              </div>
              <TriangleAlert size={19} />
            </div>
            <div className="record-list">
              {learner.mistakeLog.slice(0, 5).map((entry) => (
                <div className="record-row" key={entry.id}>
                  <span className={`severity ${entry.severity}`} />
                  <div>
                    <strong>{getSkill(entry.skillId).name}</strong>
                    <p>
                      {getMisconceptionCategory(entry.categoryId).label}:{' '}
                      {entry.misconception}
                    </p>
                    <small>{entry.correction}</small>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="tool-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Attempts</p>
                <h3>Submission evidence</h3>
              </div>
              <Save size={19} />
            </div>
            <div className="record-list">
              {learner.attemptLog.slice(0, 5).map((entry) => (
                <div className="record-row" key={entry.id}>
                  <span className="event-icon">{activityIcon('submission')}</span>
                  <div>
                    <strong>
                      {getSkill(entry.skillId).name} | {entry.score}/{entry.maxScore}
                    </strong>
                    <p>{entry.feedback}</p>
                    <small>
                      Confidence {entry.confidenceBefore}% to {entry.confidenceAfter}%
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="tool-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Record</p>
                <h3>Learning log</h3>
              </div>
              <BookOpen size={19} />
            </div>
            <div className="record-list">
              {learner.activityLog.slice(0, 6).map((entry) => (
                <div className="record-row" key={entry.id}>
                  <span className="event-icon">{activityIcon(entry.type)}</span>
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{entry.detail}</p>
                    <small>{formatDate(entry.date)}</small>
                  </div>
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
