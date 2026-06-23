import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { evaluateMathAnswer } from '../src/domain/mathAnswer.js'
import {
  addProblemSet,
  concepts,
  createGuidedSolution,
  createLearnerProfile,
  diagnosticQuestions,
  evaluateResponse,
  evaluateWorkSteps,
  getLesson,
  getLessonChecks,
  getRubricCalibrationCases,
  getRubricCalibrationSummary,
  getProblem,
  orderChoices,
  problemBank,
  submitResponse,
} from '../src/domain/tutorEngine.js'

describe('evaluateMathAnswer', () => {
  it('varies correct-answer positions without changing question identity', () => {
    const questions = [
      ...diagnosticQuestions,
      ...concepts.flatMap((concept) => getLessonChecks(concept.id)),
    ]
    const correctPositions = questions.map((question) =>
      orderChoices(question.id, question.choices).findIndex(
        (choice) => choice.id === question.correctChoiceId,
      ),
    )

    assert.deepEqual(
      orderChoices(questions[0].id, questions[0].choices),
      orderChoices(questions[0].id, questions[0].choices),
    )
    assert.ok(new Set(correctPositions).size >= 3)
    assert.ok(correctPositions.some((position) => position > 0))
  })

  it('builds a full learn-example-try sequence for every concept', () => {
    concepts.forEach((concept) => {
      const lesson = getLesson(concept.id)

      assert.equal(lesson.lecture.length, 3)
      assert.equal(lesson.workedExamples.length, 2)
      assert.ok(lesson.workedExamples.every((example) => example.steps.length > 0))
      assert.ok(
        lesson.workedExamples.every((example) =>
          example.steps.every((step) => step.why.trim().length > 0),
        ),
      )
      assert.equal(lesson.tryIt.conceptId, concept.id)
      assert.ok(lesson.tryIt.prompt.length > 0)
      assert.ok(problemBank.some((problem) => problem.id === lesson.tryIt.id))
      assert.ok(
        !problemBank.some(
          (problem) => problem.prompt === lesson.workedExamples[1].prompt,
        ),
      )
    })
  })

  it('explains why each guided solution step is useful', () => {
    const guide = createGuidedSolution(getProblem('vec-1'), '', 10)

    assert.ok(guide.steps.length > 0)
    assert.ok(guide.steps.every((step) => step.why.trim().length > 0))
  })

  it('accepts equivalent numeric forms', () => {
    assert.equal(
      evaluateMathAnswer('det = 12 - 2 = 10', {
        kind: 'number',
        value: 10,
      }).status,
      'correct',
    )
  })

  it('accepts labeled vector coordinates in order', () => {
    assert.equal(
      evaluateMathAnswer('a = 3.4 and b = 1.2', {
        kind: 'vector',
        labels: ['a', 'b'],
        values: [17 / 5, 6 / 5],
      }).status,
      'correct',
    )
  })

  it('accepts fraction vector coordinates', () => {
    assert.equal(
      evaluateMathAnswer('(5/2, 2.5)', {
        kind: 'vector',
        values: [2.5, 2.5],
      }).status,
      'correct',
    )
  })

  it('accepts bracketed matrices entry by entry', () => {
    assert.equal(
      evaluateMathAnswer('[[1, 3], [2, 4]]', {
        kind: 'matrix',
        values: [
          [1, 3],
          [2, 4],
        ],
      }).status,
      'correct',
    )
  })

  it('accepts flat matrix entries in row-major order', () => {
    assert.equal(
      evaluateMathAnswer('1 3 2 4', {
        kind: 'matrix',
        values: [
          [1, 3],
          [2, 4],
        ],
      }).status,
      'correct',
    )
  })

  it('marks parseable wrong vectors as partial', () => {
    assert.equal(
      evaluateMathAnswer('(4, 3)', {
        kind: 'vector',
        values: [4, 2],
      }).status,
      'partial',
    )
  })

  it('feeds structured vector matches into live problem feedback', () => {
    assert.equal(evaluateResponse(getProblem('vec-1'), 'a = 3.4, b = 1.2').tone, 'correct')
  })

  it('does not treat missing must-include tokens as partial evidence', () => {
    assert.equal(evaluateResponse(getProblem('least-squares-1'), 'no').headline, 'Keep shaping it')
  })

  it('detects concept-specific misconception patterns in final answers', () => {
    assert.equal(
      evaluateResponse(getProblem('mat-2'), 'put the basis images as rows').mistake?.id,
      'basis-images-as-columns',
    )
    assert.equal(
      evaluateResponse(getProblem('det-1'), 'det = 2 - 12 = -10').mistake?.id,
      'determinant-order-error',
    )
  })

  it('evaluates step-by-step work against the verified solution path', () => {
    const report = evaluateWorkSteps(getProblem('sys-1'), [
      'Add equations: 2x = 8.',
      'x = 4.',
      'Substitute 4 + y = 6, so y = 2.',
    ])

    assert.equal(report.onTrack, 3)
    assert.equal(report.headline, 'Work path is coherent')
  })

  it('uses rubric evidence instead of token overlap for work steps', () => {
    const report = evaluateWorkSteps(getProblem('sys-1'), ['Add the equations.'])

    assert.equal(report.headline, 'Revise step 1')
    assert.equal(report.feedback[0].status, 'needs-work')
    assert.equal(report.misconception, undefined)
  })

  it('accepts concise mathematical evidence in rubric-scored steps', () => {
    const report = evaluateWorkSteps(getProblem('sys-1'), ['2x=8', 'x=4', 'y=2'])

    assert.equal(report.headline, 'Work path is coherent')
    assert.equal(report.onTrack, 3)
  })

  it('flags the first drifting work step', () => {
    const report = evaluateWorkSteps(getProblem('sys-1'), ['Subtract the equations.'])

    assert.equal(report.headline, 'Repair step 1')
    assert.equal(report.feedback[0].status, 'needs-work')
    assert.equal(report.misconception?.pattern.id, 'sign-slip')
  })

  it('detects concept-specific misconception patterns in work steps', () => {
    const report = evaluateWorkSteps(getProblem('rank-nullity-1'), [
      'Use the number of rows, so rank + nullity = 4.',
    ])

    assert.equal(report.headline, 'Repair step 1')
    assert.equal(report.misconception?.pattern.id, 'rank-nullity-domain')
  })

  it('checks rubric misconceptions before accepting shared step tokens', () => {
    const report = evaluateWorkSteps(getProblem('mat-2'), [
      'Put T(e1) and T(e2) in rows.',
    ])

    assert.equal(report.headline, 'Repair step 1')
    assert.equal(report.misconception?.pattern.id, 'basis-images-as-columns')
  })

  it('uses proof rubrics for definition-level work', () => {
    const report = evaluateWorkSteps(getProblem('proof-1'), [
      'Verify the zero vector is in W.',
      'Check closure under addition for u+v.',
      'Check scalar multiplication closure for cu.',
    ])

    assert.equal(report.headline, 'Work path is coherent')
    assert.equal(report.onTrack, 3)
  })

  it('has explicit step rubrics for every verified problem', () => {
    for (const problem of problemBank) {
      assert.equal(
        problem.stepRubric?.length,
        problem.solutionSteps.length,
        `${problem.id} should have one rubric per solution step`,
      )
    }
  })

  it('distinguishes partial rubric progress from wrong-direction work', () => {
    const report = evaluateWorkSteps(getProblem('vec-2'), ['4e1 - 2e2'])

    assert.equal(report.headline, 'Refine step 1')
    assert.equal(report.partial, 1)
    assert.equal(report.feedback[0].status, 'partial')
    assert.equal(report.feedback[0].rubricScore, 2)
    assert.equal(report.feedback[0].rubricRequired, 3)
    assert.equal(report.misconception, undefined)
  })

  it('stores submitted work steps with the attempt record', () => {
    const profile = createLearnerProfile('systems')
    const activeSet = profile.problemSets[0]
    const nextProfile = submitResponse(profile, activeSet.id, 'sys-1', 'x = 4, y = 2', {
      workSteps: ['Add equations: 2x = 8.', 'x = 4.', 'Substitute for y.'],
    })

    assert.deepEqual(nextProfile.attempts[0].workSteps, [
      'Add equations: 2x = 8.',
      'x = 4.',
      'Substitute for y.',
    ])
    assert.deepEqual(activeSet.progress['sys-1'].workSteps, [])
    assert.equal(nextProfile.problemSets[0].progress['sys-1'].workSteps[1], 'x = 4.')
  })

  it('does not log partial work as a misconception when the final answer is correct', () => {
    const profile = createLearnerProfile('vectors')
    const activeSet = profile.problemSets[0]
    const nextProfile = submitResponse(profile, activeSet.id, 'vec-2', '4e1 - 2e2 + 5e3', {
      workSteps: ['4e1 - 2e2'],
    })

    assert.equal(nextProfile.attempts[0].misconceptionId, undefined)
    assert.equal(nextProfile.attempts[0].feedback.includes('1 partial'), true)
    assert.equal(nextProfile.mistakes.length, 0)
  })

  it('does not log missing evidence as a misconception when the final answer is correct', () => {
    const profile = createLearnerProfile('systems')
    const activeSet = profile.problemSets[0]
    const nextProfile = submitResponse(profile, activeSet.id, 'sys-1', 'x = 4, y = 2', {
      workSteps: ['Add the equations.'],
    })

    assert.equal(nextProfile.attempts[0].misconceptionId, undefined)
    assert.equal(nextProfile.mistakes.length, 0)
  })

  it('logs step misconceptions even when the final answer is correct', () => {
    const profile = createLearnerProfile('systems')
    const activeSet = profile.problemSets[0]
    const nextProfile = submitResponse(profile, activeSet.id, 'sys-1', 'x = 4, y = 2', {
      workSteps: ['Subtract the equations.'],
    })

    assert.equal(nextProfile.attempts[0].misconceptionId, 'sign-slip')
    assert.equal(nextProfile.mistakes[0].source, 'work-step')
    assert.equal(nextProfile.mistakes[0].stepIndex, 0)
    assert.equal(nextProfile.mistakes[0].misconceptionId, 'sign-slip')
  })

  it('routes repair sets toward the next open misconception', () => {
    const profile = createLearnerProfile('systems')
    const activeSet = profile.problemSets[0]
    const profileWithRepair = submitResponse(
      profile,
      activeSet.id,
      'sys-1',
      'x = 4, y = 2',
      {
        workSteps: ['Subtract the equations.'],
      },
    )
    const repairedProfile = addProblemSet(profileWithRepair, 'repair')
    const repairSet = repairedProfile.problemSets[0]

    assert.equal(repairSet.repairFocus?.misconceptionId, 'sign-slip')
    assert.equal(repairSet.title, 'Sign or arithmetic slip repair set')
    assert.equal(repairSet.problemIds[0], 'sys-repair-sign')
    assert.ok(repairSet.problemIds.includes('sys-1'))
  })

  it('keeps repair-only variants out of ordinary adaptive sets', () => {
    const profile = createLearnerProfile('matrix-transformations')
    const activeSet = profile.problemSets[0]
    const repairVariantIds = new Set(
      problemBank.filter((problem) => problem.repairOnly).map((problem) => problem.id),
    )

    assert.equal(activeSet.problemIds.some((problemId) => repairVariantIds.has(problemId)), false)
  })

  it('prioritizes matching repair-only variants in targeted repair sets', () => {
    const profile = createLearnerProfile('matrix-transformations')
    const activeSet = profile.problemSets[0]
    const profileWithRepair = submitResponse(
      profile,
      activeSet.id,
      'mat-2',
      'put the basis images as rows',
    )
    const repairedProfile = addProblemSet(profileWithRepair, 'repair')
    const repairSet = repairedProfile.problemSets[0]

    assert.equal(repairSet.repairFocus?.misconceptionId, 'basis-images-as-columns')
    assert.equal(repairSet.problemIds[0], 'mat-repair-columns')
    assert.equal(getProblem(repairSet.problemIds[0]).repairOnly, true)
  })

  it('prefers targeted repairs over legacy untargeted repairs', () => {
    const profile = createLearnerProfile('systems')
    const activeSet = profile.problemSets[0]
    const profileWithRepair = submitResponse(profile, activeSet.id, 'sys-1', 'x = 4, y = 2', {
      workSteps: ['Subtract the equations.'],
    })
    const profileWithLegacyRepair = {
      ...profileWithRepair,
      mistakes: [
        {
          ...profileWithRepair.mistakes[0],
          id: 'legacy-mistake',
          label: 'Legacy repair',
          misconceptionId: undefined,
        },
        ...profileWithRepair.mistakes,
      ],
    }
    const repairedProfile = addProblemSet(profileWithLegacyRepair, 'repair')

    assert.equal(repairedProfile.problemSets[0].repairFocus?.misconceptionId, 'sign-slip')
  })

  it('validates rubric calibration samples across every problem', () => {
    const cases = getRubricCalibrationCases()
    const expectedKinds = ['almost-complete', 'complete', 'missing-evidence', 'wrong-direction']

    for (const problem of problemBank) {
      const problemCases = cases.filter((calibrationCase) => calibrationCase.problemId === problem.id)

      assert.deepEqual(
        problemCases.map((calibrationCase) => calibrationCase.kind).sort(),
        expectedKinds,
        `${problem.id} should have four rubric calibration samples`,
      )
    }

    for (const calibrationCase of cases) {
      const report = evaluateWorkSteps(getProblem(calibrationCase.problemId), calibrationCase.workSteps)
      const { expected } = calibrationCase

      assert.equal(
        report.headline.startsWith(expected.headlineStartsWith),
        true,
        `${calibrationCase.problemId} ${calibrationCase.kind} headline should start with ${expected.headlineStartsWith}`,
      )
      assert.equal(
        report.partial,
        expected.partial,
        `${calibrationCase.problemId} ${calibrationCase.kind} partial count`,
      )

      if (expected.stepIndex !== undefined && expected.status) {
        assert.equal(
          report.feedback[expected.stepIndex].status,
          expected.status,
          `${calibrationCase.problemId} ${calibrationCase.kind} step status`,
        )
      } else {
        assert.equal(
          report.feedback.every((step) => step.status === 'on-track'),
          true,
          `${calibrationCase.problemId} ${calibrationCase.kind} should keep every step on track`,
        )
      }

      assert.equal(
        report.misconception?.pattern.id,
        expected.misconceptionId,
        `${calibrationCase.problemId} ${calibrationCase.kind} misconception`,
      )
    }
  })

  it('summarizes rubric calibration coverage for audit views', () => {
    const summary = getRubricCalibrationSummary()

    assert.equal(summary.problemCount, problemBank.length)
    assert.equal(summary.caseCount, problemBank.length * summary.casesPerProblem)
    assert.equal(summary.misconceptionCaseCount, problemBank.length)
    assert.ok(summary.partialCaseCount > 0)
  })
})
