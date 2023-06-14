import { Type, Static } from '@fastify/type-provider-typebox'
import { regexDate, regexPassword, regexObjectId, getUsers, createUserResponseSchema } from '../user/user.schemas'
import {
  answerResponseSchema,
  answersResponseSchema,
  getAlgorithmResponseSchema,
  getAlgorithmsResponseSchema
} from '../questionnaire/questionnaire.schemas'

const doctorCore = {
  birth: Type.Date(),
  gender: Type.Union([
    Type.Literal('MASCULINE'),
    Type.Literal('FEMININE'),
    Type.Literal('NEUTER')
  ]),
  height: Type.Number({ exclusiveMinimum: 0, maximum: 3 }),
  weight: Type.Number({ exclusiveMinimum: 0, maximum: 600 })
}

const doctorAttributes = {
  email: Type.String({ format: 'email' }),
  name: Type.String({ maxLength: 40 }),
  birthInput: Type.RegEx(regexDate),
  password: Type.RegEx(regexPassword),
  passwordInput: Type.String({
    minLength: 8,
    maxLength: 15
  }),
  verificationCode: Type.String({ format: 'uuid' }),
  verified: Type.Boolean({ default: false }),
  id: Type.RegEx(regexObjectId),
  accessToken: Type.String(),
  refreshToken: Type.String(),
  message: Type.String(),
  ids: Type.Array(Type.RegEx(regexObjectId))
}

const { gender, height, weight } = doctorCore
const { id, message, name, email, ids, birthInput } = doctorAttributes

const idParamsSchema = Type.Object({
  id
})

const emailParamSchema = Type.Object({
  email
})

const getUserQuestionnaireIdParamsSchema = Type.Object({
  userId: id,
  questionnaireId: id
})

const createDoctorResponseSchema = Type.Object({
  birth: birthInput,
  email,
  gender,
  height,
  name,
  weight,
  id
})

const createManyDoctorsBodySchema = Type.Object({
  ids
})

const addQuestionnaireToUserBodySchema = Type.Object({
  questionnaires: ids
})

const messageResponseSchema = Type.Object({
  message
})

const errorResponseSchema = Type.Object({
  message
})

const getUserAnswerQueryStringSchema = Type.Object({
  all: Type.Optional(Type.Boolean())
})

const getUserInformationQueryStringSchema = Type.Object({
  all: Type.Optional(Type.Boolean()),
  info: Type.Union([
    Type.Literal('answers'),
    Type.Literal('algorithms')
  ])
})

const CreateDoctorSchema = {
  params: emailParamSchema,
  response: {
    201: createDoctorResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const CreateManyDoctorsSchema = {
  body: createManyDoctorsBodySchema,
  response: {
    201: Type.Array(createDoctorResponseSchema),
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetDoctorAuthenticatedSchema = {
  response: {
    200: createDoctorResponseSchema,
    500: Type.Unknown()
  }
}

const AddQuestionnairesToUserSchema = {
  params: idParamsSchema,
  body: addQuestionnaireToUserBodySchema,
  response: {
    200: messageResponseSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
    500: Type.Any()
  }
}

const AddDoctorToUserSchema = {
  params: emailParamSchema,
  response: {
    200: messageResponseSchema,
    404: errorResponseSchema,
    500: Type.Any()
  }
}

const GetUserAnswerSchema = {
  params: getUserQuestionnaireIdParamsSchema,
  querystring: getUserAnswerQueryStringSchema,
  response: {
    200: Type.Union([
      answerResponseSchema,
      answersResponseSchema,
      messageResponseSchema
    ]),
    403: errorResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetUserInformationSchema = {
  params: getUserQuestionnaireIdParamsSchema,
  querystring: getUserInformationQueryStringSchema,
  response: {
    200: Type.Union([
      answerResponseSchema,
      answersResponseSchema,
      getAlgorithmResponseSchema,
      getAlgorithmsResponseSchema,
      messageResponseSchema
    ]),
    403: errorResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetUserAlgorithmsSchema = {
  params: getUserQuestionnaireIdParamsSchema,
  querystring: getUserAnswerQueryStringSchema,
  response: {
    200: Type.Union([
      getAlgorithmResponseSchema,
      getAlgorithmsResponseSchema,
      messageResponseSchema
    ]),
    403: errorResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetUsersSchema = {
  response: {
    200: getUsers,
    500: Type.Unknown()
  }
}

const GetUserSchema = {
  params: idParamsSchema,
  response: {
    200: createUserResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

type MessageResponse = Static<typeof messageResponseSchema>
type DoctorResponse = Static<typeof createDoctorResponseSchema>

export {
  CreateDoctorSchema,
  CreateManyDoctorsSchema,
  GetDoctorAuthenticatedSchema,
  AddQuestionnairesToUserSchema,
  AddDoctorToUserSchema,
  GetUserAnswerSchema,
  GetUserAlgorithmsSchema,
  GetUserInformationSchema,
  GetUsersSchema,
  GetUserSchema,
  type MessageResponse,
  type DoctorResponse
}
