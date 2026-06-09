import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { evaluateMathAnswer } from '../src/domain/mathAnswer.js'
import {
  createLearnerProfile,
  evaluateResponse,
  evaluateWorkSteps,
  getProblem,
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
})
