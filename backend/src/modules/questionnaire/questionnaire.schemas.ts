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
  ])
}

const questionnaireCore = {
  name: Type.String(),
  questions: Type.Record(
    Type.String(),
    questionnaireAttributes.questionType
  ),
  additionalInformation: Type.Array(
    Type.Object({
      questions: Type.Array(Type.Integer()),
      enum: Type.Optional(Type.Array(Type.String())),
      description: Type.Optional(Type.String()),
      relations: Type.Optional(Type.Record(Type.Integer(), Type.String()))
    })
  )
}

const { name, questions, additionalInformation } = questionnaireCore
const { id, message } = questionnaireAttributes

const createQuestionnaireSchema = Type.Object({
  name,
  questions,
  additionalInformation: Type.Optional(additionalInformation)
})

const createAnswerSchema = Type.Object({
  name,
  answers: questions
})

const createQuestionnaireResponseSchema = Type.Object({
  id,
  name,
  questions,
  additionalInformation
})

const createAnswerResponseSchema = Type.Object({
  id,
  questionnaireId: id,
  name,
  answers: questions
})

const errorResponseSchema = Type.Object({
  message
})

const CreateQuestionnaireSchema = {
  body: createQuestionnaireSchema,
  response: {
    201: createQuestionnaireResponseSchema,
    500: Type.Any()
  }
}

const CreateAnswerSchema = {
  body: createAnswerSchema,
  response: {
    201: createAnswerResponseSchema,
    400: errorResponseSchema,
    500: Type.Any()
  }
}

type CreateQuestionnaireInput = Static<typeof createQuestionnaireSchema>
type Question = Static<typeof questions>
type AdditionalInformation = Static<typeof additionalInformation>

export {
  CreateQuestionnaireSchema,
  CreateAnswerSchema,
  type CreateQuestionnaireInput,
  type Question,
  type AdditionalInformation
}
