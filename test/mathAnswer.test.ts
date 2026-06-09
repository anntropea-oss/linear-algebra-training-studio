import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { evaluateMathAnswer } from '../src/domain/mathAnswer.js'
import { evaluateResponse, getProblem } from '../src/domain/tutorEngine.js'

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
})
