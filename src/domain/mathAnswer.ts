export type MathAnswerSpec =
  | {
      kind: 'number'
      value: number
      tolerance?: number
    }
  | {
      kind: 'vector'
      values: number[]
      labels?: string[]
      tolerance?: number
    }
  | {
      kind: 'matrix'
      values: number[][]
      tolerance?: number
    }

export type MathAnswerStatus = 'correct' | 'partial' | 'incorrect' | 'unreadable'

export type MathAnswerEvaluation = {
  status: MathAnswerStatus
  detail: string
  parsed?: string
}

const numberSource = String.raw`[+-]?(?:(?:\d+(?:\.\d+)?)|(?:\.\d+))(?:\s*\/\s*[+-]?(?:(?:\d+(?:\.\d+)?)|(?:\.\d+)))?`
const numberPattern = new RegExp(numberSource, 'g')
const groupedExpressionPattern = new RegExp(String.raw`(?:\(|\[)([^\]\[()\n]+)(?:\)|\])`, 'g')

const normalizeMathText = (value: string) =>
  value
    .toLowerCase()
    .replaceAll('−', '-')
    .replaceAll('–', '-')
    .replaceAll('—', '-')
    .replaceAll('λ', 'lambda')
    .replace(/\\frac\{\s*([+-]?\d+(?:\.\d+)?)\s*\}\{\s*([+-]?\d+(?:\.\d+)?)\s*\}/g, '$1/$2')
    .replace(/,/g, ',')
    .trim()

const parseNumberToken = (token: string) => {
  const compacted = token.replace(/\s+/g, '')
  if (compacted.includes('/')) {
    const [numeratorRaw, denominatorRaw] = compacted.split('/')
    const numerator = Number(numeratorRaw)
    const denominator = Number(denominatorRaw)
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return undefined
    }
    return numerator / denominator
  }

  const value = Number(compacted)
  return Number.isFinite(value) ? value : undefined
}

const extractNumbers = (value: string) =>
  Array.from(normalizeMathText(value).matchAll(numberPattern))
    .map((match) => parseNumberToken(match[0]))
    .filter((number): number is number => number !== undefined)

const closeEnough = (left: number, right: number, tolerance = 1e-6) =>
  Math.abs(left - right) <= tolerance

const sameNumberList = (left: number[], right: number[], tolerance?: number) =>
  left.length === right.length &&
  left.every((value, index) => closeEnough(value, right[index], tolerance))

const formatNumber = (value: number) => Number(value.toFixed(6)).toString()

const formatVector = (values: number[]) => `(${values.map(formatNumber).join(', ')})`

const formatMatrix = (values: number[][]) =>
  `[${values.map((row) => `[${row.map(formatNumber).join(', ')}]`).join(', ')}]`

const parseAssignments = (response: string) => {
  const assignments = new Map<string, number>()
  const assignmentPattern = new RegExp(String.raw`\b([a-z][a-z0-9]*)\s*=\s*(${numberSource})`, 'g')
  for (const match of normalizeMathText(response).matchAll(assignmentPattern)) {
    const value = parseNumberToken(match[2])
    if (value !== undefined) {
      assignments.set(match[1], value)
    }
  }
  return assignments
}

const parseVectorCandidates = (response: string, expectedSize: number) => {
  const normalized = normalizeMathText(response)
  const candidates: number[][] = []
  for (const match of normalized.matchAll(groupedExpressionPattern)) {
    const values = extractNumbers(match[1])
    if (values.length === expectedSize) {
      candidates.push(values)
    }
  }

  const allNumbers = extractNumbers(normalized)
  if (allNumbers.length === expectedSize) {
    candidates.push(allNumbers)
  }

  return candidates
}

const parseVectorAnswers = (
  response: string,
  spec: Extract<MathAnswerSpec, { kind: 'vector' }>,
) => {
  const labels = spec.labels?.map((label) => label.toLowerCase())
  const candidates: number[][] = []
  if (labels?.length) {
    const assignments = parseAssignments(response)
    if (labels.every((label) => assignments.has(label))) {
      candidates.push(labels.map((label) => assignments.get(label) as number))
    }
  }

  candidates.push(...parseVectorCandidates(response, spec.values.length))

  return candidates
}

const chunkMatrix = (values: number[], rows: number, columns: number) => {
  if (values.length !== rows * columns) return undefined
  return Array.from({ length: rows }, (_, rowIndex) =>
    values.slice(rowIndex * columns, rowIndex * columns + columns),
  )
}

const parseMatrix = (response: string, spec: Extract<MathAnswerSpec, { kind: 'matrix' }>) => {
  const rows = spec.values.length
  const columns = spec.values[0]?.length ?? 0
  const normalized = normalizeMathText(response)
  const rowMatches = Array.from(normalized.matchAll(groupedExpressionPattern))
    .map((match) => extractNumbers(match[1]))
    .filter((row) => row.length === columns)

  if (rowMatches.length === rows) {
    return rowMatches
  }

  if (normalized.includes(';')) {
    const semicolonRows = normalized
      .split(';')
      .map(extractNumbers)
      .filter((row) => row.length > 0)
    if (semicolonRows.length === rows && semicolonRows.every((row) => row.length === columns)) {
      return semicolonRows
    }
  }

  return chunkMatrix(extractNumbers(normalized), rows, columns)
}

const evaluateNumberAnswer = (
  response: string,
  spec: Extract<MathAnswerSpec, { kind: 'number' }>,
): MathAnswerEvaluation => {
  const numbers = extractNumbers(response)
  if (numbers.length === 0) {
    return {
      status: 'unreadable',
      detail: 'I could not read a numeric answer yet.',
    }
  }

  const match = numbers.find((value) => closeEnough(value, spec.value, spec.tolerance))
  if (match !== undefined) {
    return {
      status: 'correct',
      detail: `I read ${formatNumber(match)}, which matches the expected value.`,
      parsed: formatNumber(match),
    }
  }

  return {
    status: 'partial',
    detail: `I read ${numbers.map(formatNumber).join(', ')}, but not the target value.`,
    parsed: numbers.map(formatNumber).join(', '),
  }
}

const evaluateVectorAnswer = (
  response: string,
  spec: Extract<MathAnswerSpec, { kind: 'vector' }>,
): MathAnswerEvaluation => {
  const parsedCandidates = parseVectorAnswers(response, spec)
  if (!parsedCandidates.length) {
    return {
      status: 'unreadable',
      detail: `I am looking for ${spec.values.length} coordinate values.`,
    }
  }

  const matched = parsedCandidates.find((candidate) =>
    sameNumberList(candidate, spec.values, spec.tolerance),
  )
  if (matched) {
    return {
      status: 'correct',
      detail: `I read ${formatVector(matched)}, which matches coordinate by coordinate.`,
      parsed: formatVector(matched),
    }
  }

  const parsed = parsedCandidates[parsedCandidates.length - 1]
  return {
    status: parsed.length === spec.values.length ? 'partial' : 'incorrect',
    detail: `I read ${formatVector(parsed)}, but one or more coordinates differ from ${formatVector(
      spec.values,
    )}.`,
    parsed: formatVector(parsed),
  }
}

const evaluateMatrixAnswer = (
  response: string,
  spec: Extract<MathAnswerSpec, { kind: 'matrix' }>,
): MathAnswerEvaluation => {
  const parsed = parseMatrix(response, spec)
  if (!parsed) {
    return {
      status: 'unreadable',
      detail: `I am looking for a ${spec.values.length} by ${spec.values[0]?.length ?? 0} matrix.`,
    }
  }

  const rowsMatch =
    parsed.length === spec.values.length &&
    parsed.every((row, index) => sameNumberList(row, spec.values[index], spec.tolerance))

  if (rowsMatch) {
    return {
      status: 'correct',
      detail: `I read ${formatMatrix(parsed)}, which matches entry by entry.`,
      parsed: formatMatrix(parsed),
    }
  }

  return {
    status: 'partial',
    detail: `I read ${formatMatrix(parsed)}, but at least one entry differs from ${formatMatrix(
      spec.values,
    )}.`,
    parsed: formatMatrix(parsed),
  }
}

export const evaluateMathAnswer = (
  response: string,
  spec: MathAnswerSpec,
): MathAnswerEvaluation => {
  if (!response.trim()) {
    return {
      status: 'unreadable',
      detail: 'No mathematical answer has been entered yet.',
    }
  }

  if (spec.kind === 'number') return evaluateNumberAnswer(response, spec)
  if (spec.kind === 'vector') return evaluateVectorAnswer(response, spec)
  return evaluateMatrixAnswer(response, spec)
}
