import { Type, Static } from '@fastify/type-provider-typebox'
import { regexObjectId } from '../user/user.schemas'

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
  )
}

const { id, message, questionType, answers } = questionnaireAttributes

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
      relations: Type.Optional(Type.Record(Type.Integer(), Type.String())),
      default: Type.Optional(Type.Boolean())
    })
  )
}

const { name, questions, additionalInformation } = questionnaireCore

const createQuestionnaireSchema = Type.Object({
  name,
  questions,
  additionalInformation: Type.Optional(additionalInformation)
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

const createAnswerResponseSchema = Type.Object({
  id,
  questionnaireId: id,
  name,
  answers
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
type Questions = Static<typeof questions>
type QuestionType = Static<typeof questionType>
type AnswerUser = Static<typeof answers>
type AdditionalInformation = Static<typeof additionalInformation>

export {
  CreateQuestionnaireSchema,
  CreateAnswerSchema,
  type CreateQuestionnaireInput,
  type Questions,
  type QuestionType,
  type AnswerUser,
  type AdditionalInformation
}
