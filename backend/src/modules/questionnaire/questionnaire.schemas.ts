import { Type, Static } from '@fastify/type-provider-typebox'

const regexObjectId = /^[a-fA-F0-9]{24}$/

const questionnaireAttributes = {
  id: Type.RegEx(regexObjectId),
  message: Type.String(),
  questionType: Type.Union([
    Type.Literal('PRIMARY_TEXT'),
    Type.Literal('PRIMARY_NUMBER'),
    Type.Literal('PRIMARY_BOOL'),
    Type.Literal('SECONDARY_TEXT'),
    Type.Literal('SECONDARY_NUMBER'),
    Type.Literal('SECONDARY_BOOL')
  ]),
  answers: Type.Record(
    Type.String(),
    Type.Union([
      Type.String(),
      Type.Number(),
      Type.Boolean(),
      Type.Null()
    ])
  ),
  stopBangAnswer: Type.Record(Type.String(), Type.Boolean()),
  epworthSleepinessScaleAnswer: Type.Record(Type.String(), Type.Integer()),
  perceivedStressQuestionnaireAnswer: Type.Record(Type.String(), Type.String())
}

const algorithmAttributes = {
  stopBangWarning: Type.Union([
    Type.Literal('OSA - Low Risk'),
    Type.Literal('OSA - Intermediate Risk'),
    Type.Literal('OSA - High Risk')
  ]),
  stopBangRisk: Type.Integer({ minimum: 0, maximum: 8 }),
  epworthSleepinessScaleWarning: Type.Union([
    Type.Literal('Lower Normal Daytime Sleepiness'),
    Type.Literal('Higher Normal Daytime Sleepiness'),
    Type.Literal('Mild Excessive Normal Daytime Sleepiness'),
    Type.Literal('Moderate Excessive Normal Daytime Sleepiness'),
    Type.Literal('Severe Excessive Normal Daytime Sleepiness')
  ]),
  epworthSleepinessScaleRisk: Type.Integer({ minimum: 0, maximum: 24 }),
  pittsburghSleepQualityIndex: Type.Integer({ minimum: 0, maximum: 21 }),
  perceivedStressQuestionnaireRisk: Type.Number(),
  perceivedStressQuestionnaireEmotions: Type.Object({
    worries: Type.Number(),
    tension: Type.Number(),
    joy: Type.Number(),
    requirements: Type.Number()
  }),
  athensInsomniaScale: Type.Integer({ minimum: 0, maximum: 24 }),
  internationalRestlessLegsScale: Type.Integer({ minimum: 0, maximum: 40 }),
  insomniaSeverityIndexWarning: Type.Union([
    Type.Literal('No clinically significant insomnia'),
    Type.Literal('Subthreshold insomnia'),
    Type.Literal('Clinical insomnia (moderate severity)'),
    Type.Literal('Clinical insomnia (severe)')
  ]),
  insomniaSeverityIndexRisk: Type.Integer({ minimum: 0, maximum: 28 })
}

const {
  id,
  message,
  questionType,
  answers,
  stopBangAnswer,
  epworthSleepinessScaleAnswer,
  perceivedStressQuestionnaireAnswer
} = questionnaireAttributes

const {
  stopBangWarning,
  epworthSleepinessScaleWarning,
  insomniaSeverityIndexWarning,
  athensInsomniaScale,
  epworthSleepinessScaleRisk,
  insomniaSeverityIndexRisk,
  internationalRestlessLegsScale,
  perceivedStressQuestionnaireRisk,
  perceivedStressQuestionnaireEmotions,
  pittsburghSleepQualityIndex,
  stopBangRisk
} = algorithmAttributes

const questionnaireCore = {
  name: Type.String(),
  questions: Type.Record(
    Type.String(),
    questionType
  ),
  additionalInformation: Type.Array(
    Type.Object({
      questions: Type.Array(Type.Integer()),
      enum: Type.Optional(Type.Array(Type.String())),
      description: Type.Optional(Type.String()),
      relation: Type.Optional(Type.Record(Type.String(), Type.Number())),
      default: Type.Optional(Type.Boolean())
    })
  ),
  instructions: Type.String()
}

const { name, questions, additionalInformation, instructions } = questionnaireCore

const createQuestionnaireSchema = Type.Object({
  name,
  questions,
  additionalInformation: Type.Optional(additionalInformation),
  instructions
})

const createAnswerSchema = Type.Object({
  name,
  answers
})

const createQuestionnaireResponseSchema = Type.Object({
  id,
  name,
  questions,
  additionalInformation
})

const answerResponseSchema = Type.Object({
  id,
  questionnaireId: id,
  name,
  answers
})

const answersResponseSchema = Type.Array(answerResponseSchema)

const getIdParamsSchema = Type.Object({
  id
})

const getQuestionnaireResponseSchema = Type.Object({
  id,
  name,
  questions,
  additionalInformation,
  instructions
})

const getQuestionnairesInformationResponseSchema = Type.Array(
  Type.Object({
    id,
    name
  })
)

const errorResponseSchema = Type.Object({
  message
})

const getAlgorithmResponseSchema = Type.Object({
  stopBangWarning: Type.Optional(stopBangWarning),
  epworthSleepinessScaleWarning: Type.Optional(epworthSleepinessScaleWarning),
  insomniaSeverityIndexWarning: Type.Optional(insomniaSeverityIndexWarning),
  athensInsomniaScale: Type.Optional(athensInsomniaScale),
  epworthSleepinessScaleRisk: Type.Optional(epworthSleepinessScaleRisk),
  insomniaSeverityIndexRisk: Type.Optional(insomniaSeverityIndexRisk),
  internationalRestlessLegsScale: Type.Optional(internationalRestlessLegsScale),
  perceivedStressQuestionnaireRisk: Type.Optional(perceivedStressQuestionnaireRisk),
  perceivedStressQuestionnaireEmotions: Type.Optional(perceivedStressQuestionnaireEmotions),
  pittsburghSleepQualityIndex: Type.Optional(pittsburghSleepQualityIndex),
  stopBangRisk: Type.Optional(stopBangRisk)
})

const getAlgorithmsResponseSchema = Type.Array(getAlgorithmResponseSchema)

const createAlgorithmSchema = Type.Object(algorithmAttributes)

const getDefaultAlgorithmInformationResponseSchema = Type.Array(Type.Object({
  index: Type.Integer(),
  question: Type.String(),
  answer: Type.Boolean(),
  dbInformation: Type.Union([
    Type.String(),
    Type.Number(),
    Type.Boolean()
  ])
}))

const CreateQuestionnaireSchema = {
  body: createQuestionnaireSchema,
  response: {
    201: createQuestionnaireResponseSchema,
    500: Type.Unknown()
  }
}

const GetQuestionnaireSchema = {
  params: getIdParamsSchema,
  response: {
    200: getQuestionnaireResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetQuestionnairesInformationSchema = {
  querystring: Type.Object({ dev: Type.Optional(Type.Boolean()) }),
  response: {
    200: getQuestionnairesInformationResponseSchema,
    500: Type.Unknown()
  }
}

const CreateAnswerSchema = {
  body: createAnswerSchema,
  response: {
    201: answerResponseSchema,
    400: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetLastAlgorithmSchema = {
  params: getIdParamsSchema,
  response: {
    200: getAlgorithmResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetAlgorithmSchema = {
  params: getIdParamsSchema,
  response: {
    200: getAlgorithmsResponseSchema,
    500: Type.Unknown()
  }
}

const GetDefaultAlgorithmInformationSchema = {
  params: getIdParamsSchema,
  response: {
    200: getDefaultAlgorithmInformationResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}
type CreateQuestionnaireInput = Static<typeof createQuestionnaireSchema>
type Questions = Static<typeof questions>
type QuestionType = Static<typeof questionType>
type AnswerUser = Static<typeof answers>
type AnswerStopBang = Static<typeof stopBangAnswer>
type AnswerEpworthSleepinessScale = Static<typeof epworthSleepinessScaleAnswer>
type PerceivedStressQuestionnaireAnswer = Static<typeof perceivedStressQuestionnaireAnswer>
type AdditionalInformation = Static<typeof additionalInformation>
type CreateAlgorithmInput = Partial<Static<typeof createAlgorithmSchema>>
type StopBangWarning = Static<typeof stopBangWarning>
type EpworthSleepinessScaleWarning = Static<typeof epworthSleepinessScaleWarning>
type InsomniaSeverityIndexWarning = Static<typeof insomniaSeverityIndexWarning>
type DefaultAlgorithmInformation = Static<typeof getDefaultAlgorithmInformationResponseSchema>
type PerceivedStressQuestionnaireEmotions = Partial<Static<typeof perceivedStressQuestionnaireEmotions>>

export {
  getAlgorithmResponseSchema,
  getAlgorithmsResponseSchema,
  answerResponseSchema,
  answersResponseSchema,
  CreateQuestionnaireSchema,
  CreateAnswerSchema,
  GetQuestionnaireSchema,
  GetQuestionnairesInformationSchema,
  GetLastAlgorithmSchema,
  GetAlgorithmSchema,
  GetDefaultAlgorithmInformationSchema,
  type CreateQuestionnaireInput,
  type Questions,
  type QuestionType,
  type AnswerUser,
  type AnswerStopBang,
  type AnswerEpworthSleepinessScale,
  type AdditionalInformation,
  type CreateAlgorithmInput,
  type StopBangWarning,
  type EpworthSleepinessScaleWarning,
  type InsomniaSeverityIndexWarning,
  type DefaultAlgorithmInformation,
  type PerceivedStressQuestionnaireEmotions,
  type PerceivedStressQuestionnaireAnswer
}
