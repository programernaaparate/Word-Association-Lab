import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  evaluateConceptAnswerWithAi,
  evaluateWordChainNodeWithAi,
  hasOpenAiAccess,
} from '../utils/openai.js'

const router = Router()

const buildAiUnavailableResponse = (error) => {
  const message = String(error?.message || '')
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes('quota') || normalizedMessage.includes('billing')) {
    return {
      available: false,
      accepted: false,
      confidence: 0,
      reason:
        'AI evaluacija trenutno nije dostupna jer OpenAI nalog nema dostupan kredit ili billing nije aktivan.',
    }
  }

  if (
    normalizedMessage.includes('invalid api key') ||
    normalizedMessage.includes('incorrect api key') ||
    normalizedMessage.includes('unauthorized')
  ) {
    return {
      available: false,
      accepted: false,
      confidence: 0,
      reason: 'AI evaluacija trenutno nije dostupna jer OpenAI API kljuc nije validan.',
    }
  }

  return {
    available: false,
    accepted: false,
    confidence: 0,
    reason: 'AI evaluacija trenutno nije dostupna. Pokusaj ponovo kasnije.',
  }
}

router.post('/concept-answer', requireAuth, async (req, res) => {
  const { words, canonicalAnswer, submittedAnswer, category, difficulty } = req.body || {}

  if (!Array.isArray(words) || !String(submittedAnswer || '').trim()) {
    return res.status(400).json({ message: 'Nedostaju podaci za AI procjenu odgovora.' })
  }

  if (!hasOpenAiAccess()) {
    return res.json({
      available: false,
      accepted: false,
      confidence: 0,
      reason: 'AI evaluacija nije ukljucena na serveru.',
    })
  }

  try {
    const result = await evaluateConceptAnswerWithAi({
      words,
      canonicalAnswer,
      submittedAnswer,
      category,
      difficulty,
    })

    return res.json({
      available: true,
      accepted: Boolean(result.accepted),
      confidence: Number(result.confidence || 0),
      reason: result.reason || '',
    })
  } catch (error) {
    return res.json(buildAiUnavailableResponse(error))
  }
})

router.post('/word-chain-node', requireAuth, async (req, res) => {
  const {
    centerWord,
    candidateWord,
    relation,
    category,
    difficulty,
    relationExamples,
  } = req.body || {}

  if (!String(centerWord || '').trim() || !String(candidateWord || '').trim() || !String(relation || '').trim()) {
    return res.status(400).json({ message: 'Nedostaju podaci za AI procjenu cvora.' })
  }

  if (!hasOpenAiAccess()) {
    return res.json({
      available: false,
      accepted: false,
      confidence: 0,
      reason: 'AI evaluacija nije ukljucena na serveru.',
    })
  }

  try {
    const result = await evaluateWordChainNodeWithAi({
      centerWord,
      candidateWord,
      relation,
      category,
      difficulty,
      relationExamples: Array.isArray(relationExamples) ? relationExamples : [],
    })

    return res.json({
      available: true,
      accepted: Boolean(result.accepted),
      confidence: Number(result.confidence || 0),
      reason: result.reason || '',
    })
  } catch (error) {
    return res.json(buildAiUnavailableResponse(error))
  }
})

export default router
