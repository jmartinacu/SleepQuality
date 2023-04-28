// import { Static } from '@sinclair/typebox'
import { Type, Static } from '@fastify/type-provider-typebox'

type QuestionTypes = 'PRIMARY_TEXT' | 'PRIMARY_NUMBER' | 'PRIMARY_BOOL' | 'SECONDARY_TEXT' | 'SECONDARY_NUMBER' | 'SECONDARY_BOOL'
type QuestionsType = Record<string, QuestionTypes>

const checkAnswerUsers = {
  PRIMARY_TEXT: (response: any) => typeof response === 'string',
  PRIMARY_NUMBER: (response: any) => typeof response === 'number',
  PRIMARY_BOOL: (response: any) => typeof response === 'boolean',
  SECONDARY_TEXT: (response: any) => typeof response === 'string' || response === null,
  SECONDARY_NUMBER: (response: any) => typeof response === 'number' || response === null,
  SECONDARY_BOOL: (response: any) => typeof response === 'boolean' || response === null
}

const regexObjectId = /^[a-fA-F0-9]{24}$/
// name        String
// questions   Json
// createdAt   DateTime @default(now())
// updadatedAt DateTime @updatedAt
// answers     Answer[]
const questionnaireCore = {
  name: Type.String(),
  questions: Type.Any()
}

const questionnaireExtend = {
  id: Type.RegEx(regexObjectId),
  message: Type.String()
}

const { name, questions } = questionnaireCore
const { id, message } = questionnaireExtend

const createQuestionnaireSchema = Type.Object({
  name,
  questions
})

const createAnswerSchema = Type.Object({
  name,
  answers: questions
})

const createQuestionnaireResponseSchema = Type.Object({
  id,
  name,
  questions
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

export {
  CreateQuestionnaireSchema,
  CreateAnswerSchema,
  type CreateQuestionnaireInput,
  type QuestionsType,
  type QuestionTypes,
  checkAnswerUsers
}
