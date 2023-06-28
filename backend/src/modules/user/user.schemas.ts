import { Static, Type } from '@fastify/type-provider-typebox'

export const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>.?/_₹])([A-Za-z\d~`!@#$%^&*()--+={}[\]|\\:;"'<>.?/_₹]|[^ ]){8,15}$/
export const regexObjectId = /^[a-fA-F0-9]{24}$/
export const regexDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}-[0-9]{2}:[0-9]{2}$/ // DD/MM/YYYY-HH:MM
// new Date(year, monthIndex -> {0 - 11}, day, hours, minutes)

export const MAX_FILE_SIZE = 1048576
export const JPEG_EXTENSIONS = [
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp'
]
export const ALLOWED_EXTENSIONS = [
  ...JPEG_EXTENSIONS,
  'png',
  'webp'
]

const userCore = {
  birth: Type.Date(),
  gender: Type.Union([
    Type.Literal('MASCULINE'),
    Type.Literal('FEMININE'),
    Type.Literal('NEUTER')
  ]),
  height: Type.Number({ exclusiveMinimum: 0, maximum: 300 }),
  weight: Type.Number({ exclusiveMinimum: 0, maximum: 600 }),
  chronicDisorders: Type.String(),
  BMI: Type.Number({ exclusiveMinimum: 0 })
}

const sessionCore = {
  valid: Type.Boolean(),
  userId: Type.RegEx(regexObjectId)
}

const userAttributes = {
  email: Type.String({ format: 'email' }),
  name: Type.String({ maxLength: 40 }),
  birthInput: Type.RegEx(regexDate),
  password: Type.RegEx(regexPassword),
  passwordInput: Type.String({
    minLength: 8,
    maxLength: 15
  }),
  role: Type.Union([
    Type.Literal('ADMIN'),
    Type.Literal('USER')
  ], { default: 'USER' }),
  questionnairesToDo: Type.Array(Type.RegEx(regexObjectId)),
  verificationCode: Type.String({ format: 'uuid' }),
  verified: Type.Boolean({ default: false }),
  id: Type.RegEx(regexObjectId),
  ids: Type.Array(Type.RegEx(regexObjectId)),
  accessToken: Type.String(),
  refreshToken: Type.String(),
  passwordResetCode: Type.Integer({
    minimum: 10000,
    maximum: 99999
  }),
  doctorCode: Type.Integer({
    minimum: 10000,
    maximum: 99999
  }),
  profilePictureString: Type.String(),
  doctorId: Type.RegEx(regexObjectId),
  profilePicturePNG: Type.String({
    contentEncoding: 'base64',
    contentMediaType: 'image/png'
  }),
  profilePictureJPG: Type.String({
    contentEncoding: 'base64',
    contentMediaType: 'image/jpg'
  }),
  profilePictureWEBP: Type.String({
    contentEncoding: 'base64',
    contentMediaType: 'image/webp'
  }),
  csvData: Type.String({
    contentEncoding: 'base64',
    contentMediaType: 'text/csv'
  }),
  message: Type.String()
}

const {
  email,
  name,
  birthInput,
  password,
  id,
  verificationCode,
  passwordResetCode,
  role,
  profilePictureString,
  passwordInput,
  message,
  accessToken,
  refreshToken,
  profilePictureJPG,
  profilePicturePNG,
  profilePictureWEBP,
  csvData,
  verified,
  questionnairesToDo,
  ids,
  doctorId,
  doctorCode
} = userAttributes

const acceptDoctor = Type.Union([
  Type.Object({
    code: doctorCode,
    id: doctorId
  }),
  Type.Null()
])

const { BMI, birth, ...userCoreExceptBMIAndBirth } = userCore

const {
  chronicDisorders,
  gender,
  height,
  weight
} = userCoreExceptBMIAndBirth

const createUserSchema = Type.Object({
  ...userCoreExceptBMIAndBirth,
  birth: birthInput,
  email,
  name,
  password
})

const createUserServiceSchema = Type.Object({
  email,
  name,
  password,
  gender,
  birth: birthInput,
  height,
  weight,
  chronicDisorders,
  BMI: Type.Optional(BMI),
  role: Type.Optional(role),
  verificationCode: Type.Optional(verificationCode),
  passwordResetCode: Type.Optional(
    Type.Union([
      passwordResetCode,
      Type.Null()
    ])
  ),
  verified: Type.Optional(verified),
  profilePicture: Type.Optional(
    Type.Union([
      profilePictureString,
      Type.Null()
    ])
  ),
  questionnairesToDo: Type.Optional(questionnairesToDo)
})

const createUserResponseSchema = Type.Object({
  ...userCoreExceptBMIAndBirth,
  BMI,
  birth: birthInput,
  name,
  email,
  id
})

const createUserHandlerResponseSchema = Type.Object({
  ...userCore,
  email,
  name,
  id,
  verificationCode
})

const logInUserSchema = Type.Object({
  email,
  password: passwordInput
})

const logInUserResponseSchema = Type.Object({
  accessToken,
  refreshToken
})

const refreshTokenResponseSchema = Type.Pick(logInUserResponseSchema, ['accessToken'])

const refreshTokenHeaderSchema = Type.Object({
  refresh: refreshToken
})

const verifyAccountParamsSchema = Type.Object({
  id,
  verificationCode
})

const resetPasswordParamsSchema = Type.Object({
  passwordResetCode
})

const resetPasswordBodySchema = Type.Object({
  password,
  email
})

const acceptDoctorParamsSchema = Type.Object({
  id,
  doctorCode
})

const updateUserServiceSchema = Type.Object({
  gender: Type.Optional(gender),
  role: Type.Optional(role),
  height: Type.Optional(height),
  weight: Type.Optional(weight),
  chronicDisorders: Type.Optional(chronicDisorders),
  BMI: Type.Optional(BMI),
  verified: Type.Optional(verified),
  passwordResetCode: Type.Optional(Type.Union([
    passwordResetCode,
    Type.Null()
  ])),
  password: Type.Optional(password),
  profilePicture: Type.Optional(profilePictureString),
  doctorId: Type.Optional(doctorId),
  questionnairesToDo: Type.Optional(questionnairesToDo),
  acceptDoctor: Type.Optional(acceptDoctor)
})

const updateUserSchema = Type.Omit(updateUserServiceSchema, [
  'BMI',
  'verified',
  'passwordResetCode',
  'password',
  'profilePicture',
  'questionnairesToDo',
  'doctorId',
  'role',
  'acceptDoctor'
])

const verifyAccountResponseSchema = Type.Object({
  message
})

const errorResponseSchema = Type.Object({
  message
})

const updateSessionSchema = Type.Object({
  valid: Type.Optional(sessionCore.valid),
  userId: Type.Optional(sessionCore.userId)
})

const emailUserSchema = Type.Object({
  email
})

export const getProfilePictureResponseSchema = Type.Union([
  profilePictureJPG,
  profilePicturePNG,
  profilePictureWEBP
])

const idsUserSchema = Type.Object({
  ids
})

const getUser = Type.Object({
  email,
  name,
  id
})

const getUsers = Type.Array(getUser)

const getCSVDataQueryStringSchema = Type.Object({
  data: Type.Optional(Type.Union([
    Type.Literal('answers'),
    Type.Literal('algorithms'),
    Type.Literal('all')
  ])),
  questionnaire: Type.Optional(Type.String())
})

const getQuestionnaireInformationParamsSchema = Type.Object({
  id
})

const getQuestionnaireInformationQueryStringSchema = Type.Object({
  all: Type.Optional(Type.Boolean()),
  info: Type.Optional(Type.Union([
    Type.Literal('answers'),
    Type.Literal('algorithms')
  ]))
})

const getQuestionnaireConsensusDiaryQueryStringSchema = Type.Object({
  type: Type.Union([
    Type.Literal('morning'),
    Type.Literal('night')
  ]),
  all: Type.Optional(Type.Boolean())
})

const messageResponseSchema = Type.Object({
  message
})

// TODO CHECK RESPONSES PREHANDLERS
const CreateUserSchema = {
  body: createUserSchema,
  response: {
    201: createUserResponseSchema,
    400: errorResponseSchema,
    500: Type.Unknown()
  }
}

const RefreshTokenSchema = {
  headers: refreshTokenHeaderSchema,
  response: {
    200: refreshTokenResponseSchema,
    401: errorResponseSchema,
    400: errorResponseSchema,
    500: Type.Unknown()
  }
}

const LogInSchema = {
  body: logInUserSchema,
  response: {
    200: logInUserResponseSchema,
    401: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetUserAuthenticatedSchema = {
  response: {
    200: createUserResponseSchema,
    500: Type.Unknown()
  }
}

const DeleteUserAuthenticatedSchema = {
  response: {
    204: {},
    500: Type.Unknown()
  }
}

const UpdateUserAuthenticatedSchema = {
  body: updateUserSchema,
  response: {
    200: verifyAccountResponseSchema,
    500: Type.Unknown()
  }
}

const VerifyUserSchema = {
  params: verifyAccountParamsSchema,
  response: {
    200: verifyAccountResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const ForgotPasswordSchema = {
  body: emailUserSchema,
  response: {
    200: verifyAccountResponseSchema,
    401: errorResponseSchema,
    500: Type.Unknown()
  }
}

const ResetPasswordSchema = {
  params: resetPasswordParamsSchema,
  body: resetPasswordBodySchema,
  response: {
    200: verifyAccountResponseSchema,
    404: errorResponseSchema,
    401: errorResponseSchema,
    403: errorResponseSchema,
    500: Type.Unknown()
  }
}

const AcceptDoctorSchema = {
  params: acceptDoctorParamsSchema,
  response: {
    200: verifyAccountResponseSchema,
    401: errorResponseSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const AddProfilePictureSchema = {
  response: {
    200: verifyAccountResponseSchema,
    400: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetProfilePictureSchema = {
  response: {
    200: getProfilePictureResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetCSVDataSchema = {
  querystring: getCSVDataQueryStringSchema,
  response: {
    200: csvData,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const GetQuestionnaireInformationSchema = {
  params: getQuestionnaireInformationParamsSchema,
  querystring: getQuestionnaireInformationQueryStringSchema,
  response: {
    500: Type.Unknown()
  }
}

const GetQuestionnaireConsensusDiarySchema = {
  querystring: getQuestionnaireConsensusDiaryQueryStringSchema,
  response: {
    500: Type.Unknown()
  }
}

const GetAdminSchema = {
  response: {
    200: messageResponseSchema,
    400: errorResponseSchema,
    403: errorResponseSchema,
    500: Type.Unknown()
  }
}

type CreateUserInput = Static<typeof createUserSchema>
type CreateUserResponse = Static<typeof createUserResponseSchema>
type CreateUserServiceInput = Static<typeof createUserServiceSchema>
type CreateUserHandlerResponse = Static<typeof createUserHandlerResponseSchema>
type LogInUserInput = Static<typeof logInUserSchema>
type LogInUserResponse = Static<typeof logInUserResponseSchema>
type EmailUserInput = Static<typeof emailUserSchema>
type UpdateUserStrictSchema = Required<Static<typeof updateUserSchema>>
type UpdateUserServiceInput = Static<typeof updateUserServiceSchema>
type VerifyAccountResponse = Static<typeof verifyAccountResponseSchema>
type IdsUserInput = Static<typeof idsUserSchema>
type UpdateSessionInput = Static<typeof updateSessionSchema>
type RefreshTokenResponse = Static<typeof refreshTokenResponseSchema>
type AcceptDoctor = Static<typeof acceptDoctor>
type Gender = Static<typeof gender>
type Role = Static<typeof role>

export {
  getUsers,
  createUserResponseSchema,
  type Gender,
  type Role,
  CreateUserSchema,
  RefreshTokenSchema,
  LogInSchema,
  GetUserAuthenticatedSchema,
  DeleteUserAuthenticatedSchema,
  UpdateUserAuthenticatedSchema,
  VerifyUserSchema,
  ForgotPasswordSchema,
  AcceptDoctorSchema,
  ResetPasswordSchema,
  AddProfilePictureSchema,
  GetProfilePictureSchema,
  GetCSVDataSchema,
  GetQuestionnaireInformationSchema,
  GetQuestionnaireConsensusDiarySchema,
  GetAdminSchema,
  type CreateUserResponse,
  type CreateUserInput,
  type CreateUserServiceInput,
  type CreateUserHandlerResponse,
  type LogInUserInput,
  type LogInUserResponse,
  type EmailUserInput,
  type VerifyAccountResponse,
  type UpdateUserServiceInput,
  type UpdateUserStrictSchema,
  type UpdateSessionInput,
  type RefreshTokenResponse,
  type IdsUserInput,
  type AcceptDoctor
}
