const LEGACY_TEXT_REPLACEMENTS = [
  ['â˜€ï¸', '☀️'],
  ['âš›ï¸', '⚛️'],
  ['âš½', '⚽'],
  ['ðŸŒŠ', '🌊'],
  ['ðŸŒŒ', '🌌'],
  ['ðŸ§²', '🧲'],
  ['ðŸƒ', '🏃'],
  ['ðŸ¤¸', '🤸'],
  ['ðŸŽ¬', '🎬'],
  ['ðŸ”º', '🔺'],
  ['ðŸ¤–', '🤖'],
  ['ðŸ“š', '📚'],
  ['ÄŒ', 'Č'],
  ['Ä', 'č'],
  ['Ä†', 'Ć'],
  ['Ä‡', 'ć'],
  ['Ä', 'Đ'],
  ['Ä‘', 'đ'],
  ['Å ', 'Š'],
  ['Å¡', 'š'],
  ['Å½', 'Ž'],
  ['Å¾', 'ž'],
]

export const repairLegacyText = (value = '') => {
  let nextValue = String(value || '')

  LEGACY_TEXT_REPLACEMENTS.forEach(([brokenValue, fixedValue]) => {
    nextValue = nextValue.split(brokenValue).join(fixedValue)
  })

  return nextValue
}

const TERM_ALIAS_GROUPS = [
  ['astronomija', 'nauka o svemiru', 'svemirska nauka'],
  ['gravitacija', 'sila teze'],
  ['fudbal', 'nogomet'],
  ['film', 'kinematografija', 'filmska umjetnost', 'filmska umetnost'],
  ['egipat', 'stari egipat', 'drevni egipat'],
  ['voda', 'h2o'],
  ['simfonija', 'orkestarsko djelo', 'orkestarsko delo'],
  ['softver', 'software', 'programska oprema'],
  ['geografija', 'nauka o zemlji'],
  ['celija', 'ćelija', 'bioloska celija', 'biološka ćelija', 'stanica'],
  ['zanr', 'žanr', 'vrsta filma', 'filmski zanr', 'filmski žanr'],
  ['pozoriste', 'pozorište', 'teatar'],
  ['racunar', 'računar', 'kompjuter', 'komputer'],
  ['mreza', 'mreža'],
  ['usce', 'ušće'],
  ['zivotinja', 'životinja', 'zivotinje', 'životinje'],
  ['planete', 'planeta', 'planeti'],
  ['meridijan', 'meridijani'],
  ['robotika', 'nauka o robotima', 'oblast robotike'],
  ['gimnastika', 'sportska gimnastika'],
  ['rukomet', 'handball'],
  ['montaza', 'montaža', 'filmska montaza', 'filmska montaža'],
  ['cirilica', 'ćirilica'],
  ['trijumf', 'pobjeda', 'uspeh', 'uspjeh'],
  ['lik', 'junak', 'karakter', 'persona'],
  ['scena', 'prizor', 'kadar'],
  ['muzika', 'glazba'],
  ['suma', 'šuma', 'gaj'],
  ['toplota', 'toplina', 'vrucina', 'vrućina'],
  ['obala', 'primorje'],
  ['pravac', 'smjer', 'smer', 'kurs'],
  ['mapa', 'karta'],
]

const RELATED_CONCEPT_GROUPS = [
  [
    'film',
    'kinematografija',
    'filmska umjetnost',
    'pozoriste',
    'pozorište',
    'teatar',
    'glumac',
    'glumci',
    'gluma',
    'scena',
    'prizor',
    'kadar',
    'rezija',
    'režija',
    'predstava',
  ],
  ['astronomija', 'svemir', 'kosmos', 'galaksija', 'orbita', 'planeta', 'zvijezda'],
  ['geografija', 'atlas', 'mapa', 'karta', 'meridijan', 'koordinate', 'kontinent'],
  ['tehnologija', 'softver', 'software', 'program', 'algoritam', 'racunar', 'računar', 'kompjuter'],
  ['sport', 'fudbal', 'nogomet', 'rukomet', 'gimnastika', 'maraton', 'trka', 'štafeta', 'stafeta'],
  ['priroda', 'voda', 'more', 'rijeka', 'šuma', 'suma', 'sunce', 'vulkan', 'planina'],
  ['umjetnost', 'muzika', 'simfonija', 'pozoriste', 'pozorište', 'teatar', 'skulptura', 'perspektiva'],
]

const normalizeBaseText = (value = '') =>
  repairLegacyText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const collapseRepeatedCharacters = (value = '') =>
  repairLegacyText(value).replace(/([a-z0-9])\1{2,}/g, '$1')

const toCompactText = (value = '') => normalizeBaseText(value).replace(/\s+/g, '')

const toCollapsedCompactText = (value = '') =>
  toCompactText(collapseRepeatedCharacters(value))

const tokenize = (value = '') => normalizeBaseText(value).split(' ').filter(Boolean)

const getLevenshteinDistance = (leftValue = '', rightValue = '') => {
  const left = String(leftValue || '')
  const right = String(rightValue || '')

  if (!left.length) return right.length
  if (!right.length) return left.length

  const matrix = Array.from({ length: left.length + 1 }, (_, rowIndex) =>
    Array.from({ length: right.length + 1 }, (_, columnIndex) =>
      rowIndex === 0 ? columnIndex : columnIndex === 0 ? rowIndex : 0
    )
  )

  for (let rowIndex = 1; rowIndex <= left.length; rowIndex += 1) {
    for (let columnIndex = 1; columnIndex <= right.length; columnIndex += 1) {
      const cost = left[rowIndex - 1] === right[columnIndex - 1] ? 0 : 1

      matrix[rowIndex][columnIndex] = Math.min(
        matrix[rowIndex - 1][columnIndex] + 1,
        matrix[rowIndex][columnIndex - 1] + 1,
        matrix[rowIndex - 1][columnIndex - 1] + cost
      )
    }
  }

  return matrix[left.length][right.length]
}

const isSmallTypoMatch = (leftValue = '', rightValue = '') => {
  const left = toCollapsedCompactText(leftValue)
  const right = toCollapsedCompactText(rightValue)

  if (!left || !right || left === right) {
    return Boolean(left && right && left === right)
  }

  const maxLength = Math.max(left.length, right.length)
  const lengthDifference = Math.abs(left.length - right.length)

  if (maxLength <= 4 || lengthDifference > 2 || left[0] !== right[0]) {
    return false
  }

  const distance = getLevenshteinDistance(left, right)

  if (maxLength <= 6) {
    return distance <= 1
  }

  if (maxLength <= 10) {
    return distance <= 2
  }

  return distance <= 2
}

const buildAliasLookup = () => {
  const aliasLookup = new Map()

  TERM_ALIAS_GROUPS.forEach((group) => {
    const normalizedGroup = [...new Set(group.map(normalizeBaseText).filter(Boolean))]

    normalizedGroup.forEach((term) => {
      aliasLookup.set(term, normalizedGroup)
    })
  })

  return aliasLookup
}

const ALIAS_LOOKUP = buildAliasLookup()

const buildRelatedLookup = () => {
  const relatedLookup = new Map()

  RELATED_CONCEPT_GROUPS.forEach((group) => {
    const normalizedGroup = [...new Set(group.map(normalizeBaseText).filter(Boolean))]

    normalizedGroup.forEach((term) => {
      relatedLookup.set(term, normalizedGroup)
    })
  })

  return relatedLookup
}

const RELATED_LOOKUP = buildRelatedLookup()

const expandAliases = (value = '') => {
  const normalizedValue = normalizeBaseText(value)
  if (!normalizedValue) {
    return []
  }

  return ALIAS_LOOKUP.get(normalizedValue) || [normalizedValue]
}

const buildComparableVariants = (value = '') => {
  const normalizedValue = normalizeBaseText(value)
  if (!normalizedValue) {
    return []
  }

  const collapsedValue = normalizeBaseText(collapseRepeatedCharacters(normalizedValue))
  const compactValue = normalizedValue.replace(/\s+/g, '')
  const collapsedCompactValue = collapsedValue.replace(/\s+/g, '')
  const sortedTokensValue = tokenize(normalizedValue).sort().join(' ')

  return [
    normalizedValue,
    collapsedValue,
    compactValue,
    collapsedCompactValue,
    sortedTokensValue,
  ].filter(Boolean)
}

const getExpandedAlternatives = (values = []) => {
  const alternatives = new Set()

  ;(values || []).forEach((value) => {
    expandAliases(value).forEach((alias) => {
      buildComparableVariants(alias).forEach((variant) => {
        alternatives.add(variant)
      })
    })
  })

  return [...alternatives]
}

const getRelatedConcepts = (values = []) => {
  const relatedConcepts = new Set()

  ;(values || []).forEach((value) => {
    const normalizedValue = normalizeBaseText(value)
    const group = RELATED_LOOKUP.get(normalizedValue) || []
    group.forEach((item) => {
      relatedConcepts.add(item)
    })
  })

  return [...relatedConcepts]
}

const findVariantMatch = (actualVariants = [], expectedVariants = []) => {
  for (const actualVariant of actualVariants) {
    for (const expectedVariant of expectedVariants) {
      if (actualVariant === expectedVariant) {
        return expectedVariant
      }

      if (isSmallTypoMatch(actualVariant, expectedVariant)) {
        return expectedVariant
      }
    }
  }

  return null
}

export const evaluateSmartConceptAnswer = (challenge = {}, actualAnswer = '') => {
  const actualVariants = buildComparableVariants(actualAnswer)

  if (!actualVariants.length) {
    return { accepted: false, partialAccepted: false, matchedAnswer: null, scoreWeight: 0 }
  }

  const acceptedCandidates = [
    challenge?.answer || '',
    ...(challenge?.acceptedAnswers || []),
  ].filter(Boolean)

  const expandedExpectedVariants = getExpandedAlternatives(acceptedCandidates)
  const directMatch = findVariantMatch(actualVariants, expandedExpectedVariants)

  if (directMatch) {
    return {
      accepted: true,
      partialAccepted: false,
      matchedAnswer: directMatch,
      scoreWeight: 1,
    }
  }

  const actualTokens = new Set(tokenize(actualAnswer))
  const acceptedPhraseMatch = acceptedCandidates.find((candidate) => {
    const candidateTokens = tokenize(candidate)

    if (!candidateTokens.length || candidateTokens.length !== actualTokens.size) {
      return false
    }

    return candidateTokens.every((token) => actualTokens.has(token))
  })

  if (acceptedPhraseMatch) {
    return {
      accepted: true,
      partialAccepted: false,
      matchedAnswer: normalizeBaseText(acceptedPhraseMatch),
      scoreWeight: 1,
    }
  }

  const actualRelatedConcepts = new Set(getRelatedConcepts([actualAnswer]))
  const expectedAndPromptConcepts = getRelatedConcepts([
    ...acceptedCandidates,
    ...(challenge?.words || []),
  ])
  const partialMatch = expectedAndPromptConcepts.find((item) => actualRelatedConcepts.has(item))

  if (partialMatch) {
    return {
      accepted: false,
      partialAccepted: true,
      matchedAnswer: partialMatch,
      scoreWeight: 0.5,
      reason: 'Odgovor je povezan sa pojmovima, ali nije najprecizniji zajednicki pojam.',
    }
  }

  return {
    accepted: false,
    partialAccepted: false,
    matchedAnswer: null,
    scoreWeight: 0,
  }
}

export const evaluateSmartWordChainCandidate = ({
  candidateWord = '',
  allowedWords = [],
} = {}) => {
  const actualVariants = buildComparableVariants(candidateWord)

  if (!actualVariants.length) {
    return { accepted: false, matchedWord: null }
  }

  for (const allowedWord of allowedWords || []) {
    const directExpectedVariants = buildComparableVariants(allowedWord)
    const directMatch = findVariantMatch(actualVariants, directExpectedVariants)

    if (directMatch) {
      return {
        accepted: true,
        matchedWord: allowedWord,
        reason:
          normalizeBaseText(candidateWord) === normalizeBaseText(allowedWord)
            ? `Prepoznata dobra veza sa pojmom "${allowedWord}".`
            : `Prepoznato kao razumna varijacija za "${allowedWord}".`,
      }
    }

  }

  for (const allowedWord of allowedWords || []) {
    const expectedVariants = getExpandedAlternatives([allowedWord])
    const matchedVariant = findVariantMatch(actualVariants, expectedVariants)

    if (matchedVariant) {
      return {
        accepted: true,
        matchedWord: allowedWord,
        reason: `Prepoznato kao razumna varijacija za "${allowedWord}".`,
      }
    }
  }

  return {
    accepted: false,
    matchedWord: null,
    reason: 'Veza nije dovoljno bliska dozvoljenim pojmovima za ovu rundu.',
  }
}

export const normalizeLooseText = normalizeBaseText
