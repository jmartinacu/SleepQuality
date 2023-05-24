import { Type, Static } from '@fastify/type-provider-typebox'
import { regexDate, regexPassword, regexObjectId } from '../user/user.schemas'

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

const { birth, gender, height, weight } = doctorCore
const { id, message, name, email, password, ids } = doctorAttributes

const createDoctorParamsSchema = Type.Object({
  id
})

const createDoctorResponseSchema = Type.Object({
  birth,
  email,
  gender,
  height,
  name,
  password,
  weight
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

const CreateDoctorSchema = {
  params: createDoctorParamsSchema,
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

const AddQuestionnairesToUserSchema = {
  params: createDoctorParamsSchema,
  body: addQuestionnaireToUserBodySchema,
  response: {
    200: messageResponseSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
    500: Type.Any()
  }
}

type MessageResponse = Static<typeof messageResponseSchema>

export {
  CreateDoctorSchema,
  CreateManyDoctorsSchema,
  AddQuestionnairesToUserSchema,
  type MessageResponse
}
