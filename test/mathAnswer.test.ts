import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { evaluateMathAnswer } from '../src/domain/mathAnswer.js'
import {
  addProblemSet,
  createLearnerProfile,
  evaluateResponse,
  evaluateWorkSteps,
  getProblem,
  problemBank,
  submitResponse,
} from '../src/domain/tutorEngine.js'

describe('evaluateMathAnswer', () => {
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
})
