const OPENAI_API_URL = 'https://api.openai.com/v1/responses'
const DEFAULT_OPENAI_MODEL = 'gpt-5-mini'

const getOptionalEnvValue = (key) => {
  const value = String(process.env[key] || '').trim()
  return value || ''
}

export const hasOpenAiAccess = () => Boolean(getOptionalEnvValue('OPENAI_API_KEY'))

const parseResponseOutputText = (responseData = {}) => {
  if (typeof responseData.output_text === 'string' && responseData.output_text.trim()) {
    return responseData.output_text.trim()
  }

  const outputItems = Array.isArray(responseData.output) ? responseData.output : []

  for (const item of outputItems) {
    const contentItems = Array.isArray(item?.content) ? item.content : []

    for (const contentItem of contentItems) {
      if (typeof contentItem?.text === 'string' && contentItem.text.trim()) {
        return contentItem.text.trim()
      }
    }
  }

  return ''
}

const createStructuredOpenAiResponse = async ({ instructions, input, schemaName }) => {
  const apiKey = getOptionalEnvValue('OPENAI_API_KEY')

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY nije postavljen.')
  }

  const model = getOptionalEnvValue('OPENAI_MODEL') || DEFAULT_OPENAI_MODEL
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions,
      input,
      max_output_tokens: 300,
      text: {
        format: {
          type: 'json_schema',
          name: schemaName,
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              accepted: { type: 'boolean' },
              confidence: { type: 'number' },
              reason: { type: 'string' },
            },
            required: ['accepted', 'confidence', 'reason'],
          },
        },
      },
    }),
  })

  const responseData = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      responseData?.error?.message || 'OpenAI odgovor nije bio uspjesan.'
    throw new Error(message)
  }

  const outputText = parseResponseOutputText(responseData)

  if (!outputText) {
    throw new Error('OpenAI nije vratio ispravan JSON odgovor.')
  }

  return JSON.parse(outputText)
}

export const evaluateConceptAnswerWithAi = async ({
  words = [],
  canonicalAnswer = '',
  submittedAnswer = '',
  category = '',
  difficulty = '',
} = {}) => {
  return createStructuredOpenAiResponse({
    schemaName: 'concept_answer_evaluation',
    instructions:
      'Ti procjenjujes odgovore za igru "Zajednicki pojam". Budi razumno fleksibilan: prihvati odgovor ako stvarno opisuje zajednicki pojam svih datih rijeci, cak i kad nije identican kanonskom odgovoru. Odbij preuske, netacne ili slucajne odgovore. Vrati samo JSON po zadatoj semi.',
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: [
              'Procijeni da li je uneseni odgovor prihvatljiv za zajednicki pojam.',
              `Rijeci: ${words.join(', ')}`,
              `Kanonski odgovor: ${canonicalAnswer || 'nije zadat'}`,
              `Kategorija: ${category || 'nije zadato'}`,
              `Tezina: ${difficulty || 'nije zadato'}`,
              `Uneseni odgovor: ${submittedAnswer}`,
              'Prihvati i semanticki bliske ili sire odgovore samo ako svi pojmovi zaista prirodno pripadaju tom pojmu.',
            ].join('\n'),
          },
        ],
      },
    ],
  })
}

export const evaluateWordChainNodeWithAi = async ({
  centerWord = '',
  candidateWord = '',
  relation = '',
  category = '',
  difficulty = '',
  relationExamples = [],
} = {}) => {
  return createStructuredOpenAiResponse({
    schemaName: 'word_chain_node_evaluation',
    instructions:
      'Ti procjenjujes da li nova rijec ima smisla u igri "Lanac rijeci". Budi konzervativan ali ne krut: prihvati rijec samo ako zaista ima smislen odnos sa centralnim pojmom za trazeni tip veze. Primjeri sluze kao orijentacija za ton veze u igri. Vrati samo JSON po zadatoj semi.',
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: [
              'Procijeni novu rijec za lanac.',
              `Centralni pojam: ${centerWord}`,
              `Nova rijec: ${candidateWord}`,
              `Trazena veza: ${relation}`,
              `Kategorija: ${category || 'nije zadato'}`,
              `Tezina: ${difficulty || 'nije zadato'}`,
              `Primjeri iste veze u ovoj igri: ${
                relationExamples.length ? relationExamples.join(', ') : 'nema'
              }`,
              'Ako je veza slaba, nategnuta ili nema dovoljno smisla, odbij je.',
            ].join('\n'),
          },
        ],
      },
    ],
  })
}
