import { query } from '../config/db.js'
import { normalizeLooseText } from '../../src/utils/localSmartMatching.js'

const WORD_CHAIN_RELATIONS = new Set(['Sinonim', 'Antonim', 'Asocijacija'])

const normalizeWordChainValue = (value = '') => normalizeLooseText(value)

const runQuery = async (sql, params = [], executor = null) => {
  if (executor?.execute) {
    const [rows] = await executor.execute(sql, params)
    return rows
  }

  return query(sql, params)
}

const parseContentFields = (content = '') => {
  const fields = new Map()

  String(content || '')
    .split('|')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .forEach((segment) => {
      const separatorIndex = segment.indexOf(':')

      if (separatorIndex === -1) {
        return
      }

      const label = normalizeWordChainValue(segment.slice(0, separatorIndex))
      const value = String(segment.slice(separatorIndex + 1)).trim()

      if (label && value && !fields.has(label)) {
        fields.set(label, value)
      }
    })

  return fields
}

const parseCategoryLabel = (value = '') => {
  const parts = String(value || '')
    .split('/')
    .map((item) => item.trim())
    .filter(Boolean)

  return parts.length ? parts[parts.length - 1] : ''
}

const normalizeRelation = (value = '') => {
  const normalized = normalizeWordChainValue(value)

  if (normalized === 'sinonim') {
    return 'Sinonim'
  }

  if (normalized === 'antonim') {
    return 'Antonim'
  }

  if (normalized === 'asocijacija') {
    return 'Asocijacija'
  }

  return ''
}

export const parseWordChainSubmissionContext = ({
  gameType = '',
  content = '',
  proposedAnswer = '',
} = {}) => {
  if (normalizeWordChainValue(gameType) !== 'lanac rijeci') {
    return null
  }

  const fields = parseContentFields(content)
  const centerWord = String(fields.get('centar') || '').trim()
  const candidateWord = String(proposedAnswer || fields.get('predlozena rijec') || '').trim()
  const relation = normalizeRelation(fields.get('tip veze') || '')
  const category = parseCategoryLabel(fields.get('kategorija') || '')
  const difficulty = String(fields.get('tezina') || '').trim()

  if (!centerWord || !candidateWord || !relation || !category || !difficulty) {
    return null
  }

  return {
    centerWord,
    candidateWord,
    relation,
    category,
    difficulty,
    normalizedCenterWord: normalizeWordChainValue(centerWord),
    normalizedCandidateWord: normalizeWordChainValue(candidateWord),
  }
}

export const upsertApprovedWordChainNode = async (payload = {}, executor = null) => {
  const centerWord = String(payload.centerWord || '').trim()
  const candidateWord = String(payload.candidateWord || '').trim()
  const relation = normalizeRelation(payload.relation || '')
  const category = String(payload.category || '').trim()
  const difficulty = String(payload.difficulty || '').trim()

  if (!centerWord || !candidateWord || !WORD_CHAIN_RELATIONS.has(relation) || !category || !difficulty) {
    return false
  }

  await runQuery(
    `INSERT INTO word_chain_approved_nodes
      (center_word, center_word_normalized, candidate_word, candidate_word_normalized,
       relation, category, difficulty, approved_submission_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       center_word = VALUES(center_word),
       candidate_word = VALUES(candidate_word),
       approved_submission_id = COALESCE(VALUES(approved_submission_id), approved_submission_id),
       updated_at = CURRENT_TIMESTAMP`,
    [
      centerWord,
      normalizeWordChainValue(centerWord),
      candidateWord,
      normalizeWordChainValue(candidateWord),
      relation,
      category,
      difficulty,
      Number(payload.approvedSubmissionId || 0) || null,
    ],
    executor
  )

  return true
}

export const getApprovedWordChainNodes = async (
  { centerWord = '', category = '', difficulty = '' } = {},
  executor = null
) => {
  const normalizedCenterWord = normalizeWordChainValue(centerWord)

  if (!normalizedCenterWord || !category || !difficulty) {
    return []
  }

  const rows = await runQuery(
    `SELECT id, center_word, candidate_word, relation, category, difficulty, approved_submission_id,
            created_at, updated_at
     FROM word_chain_approved_nodes
     WHERE center_word_normalized = ?
       AND category = ?
       AND difficulty = ?
     ORDER BY relation ASC, candidate_word ASC, id ASC`,
    [normalizedCenterWord, category, difficulty],
    executor
  )

  return rows.map((item) => ({
    id: Number(item.id || 0),
    centerWord: item.center_word,
    candidateWord: item.candidate_word,
    relation: item.relation,
    category: item.category,
    difficulty: item.difficulty,
    approvedSubmissionId: Number(item.approved_submission_id || 0) || null,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }))
}

export const buildWordChainApprovedNodeGroups = (items = []) =>
  ['Sinonim', 'Antonim', 'Asocijacija'].reduce(
    (accumulator, relation) => {
      const seenWords = new Set()
      const words = []

      items
        .filter((item) => item?.relation === relation)
        .forEach((item) => {
          const candidateWord = String(item?.candidateWord || '').trim()
          const normalizedCandidateWord = normalizeWordChainValue(candidateWord)

          if (!candidateWord || seenWords.has(normalizedCandidateWord)) {
            return
          }

          seenWords.add(normalizedCandidateWord)
          words.push(candidateWord)
        })

      return {
        ...accumulator,
        [relation]: words,
      }
    },
    {
      Sinonim: [],
      Antonim: [],
      Asocijacija: [],
    }
  )

export const backfillApprovedWordChainNodesFromSubmissions = async (executor = null) => {
  const rows = await runQuery(
    `SELECT id, game_type, content, proposed_answer
     FROM game_submissions
     WHERE submission_kind = 'answer_review'
       AND status = 'approved'
       AND LOWER(game_type) = 'lanac rijeci'`,
    [],
    executor
  )

  for (const row of rows) {
    const parsedContext = parseWordChainSubmissionContext({
      gameType: row.game_type,
      content: row.content,
      proposedAnswer: row.proposed_answer,
    })

    if (!parsedContext) {
      continue
    }

    await upsertApprovedWordChainNode(
      {
        ...parsedContext,
        approvedSubmissionId: row.id,
      },
      executor
    )
  }
}
