import { Static, Type } from '@fastify/type-provider-typebox'

const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/
const regexObjectId = /^[a-fA-F0-9]{24}$/
const regexDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/

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
  height: Type.Number({ exclusiveMinimum: 0, maximum: 3 }),
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
  verificationCode: Type.String({ format: 'uuid' }),
  verified: Type.Boolean({ default: false }),
  id: Type.RegEx(regexObjectId),
  accessToken: Type.String(),
  refreshToken: Type.String(),
  passwordResetCode: Type.Integer({
    minimum: 10000,
    maximum: 99999
  }),
  profilePictureString: Type.String(),
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
  verified
} = userAttributes

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
  id,
  passwordResetCode
})

const resetPasswordBodySchema = Type.Object({
  password
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
  profilePicture: Type.Optional(profilePictureString)
})

const updateUserSchema = Type.Omit(updateUserServiceSchema, [
  'BMI',
  'verified',
  'passwordResetCode',
  'password',
  'profilePicture'
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

const getProfilePictureResponseSchema = Type.Union([
  profilePictureJPG,
  profilePicturePNG,
  profilePictureWEBP
])

const CreateUserSchema = {
  body: createUserSchema,
  response: {
    201: createUserResponseSchema,
    400: errorResponseSchema,
    500: Type.Any()
  }
}

const RefreshTokenSchema = {
  headers: refreshTokenHeaderSchema,
  response: {
    200: refreshTokenResponseSchema,
    401: errorResponseSchema,
    400: errorResponseSchema,
    500: Type.Any()
  }
}

const LogInSchema = {
  body: logInUserSchema,
  response: {
    200: logInUserResponseSchema,
    401: errorResponseSchema,
    500: Type.Any()
  }
}

const GetUserAuthenticatedSchema = {
  response: {
    200: createUserResponseSchema,
    500: Type.Any()
  }
}

const DeleteUserAuthenticatedSchema = {
  response: {
    204: {},
    500: Type.Any()
  }
}

const UpdateUserAuthenticatedSchema = {
  body: updateUserSchema,
  response: {
    200: verifyAccountResponseSchema,
    500: Type.Any()
  }
}

const VerifyUserSchema = {
  params: verifyAccountParamsSchema,
  response: {
    200: verifyAccountResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
    500: Type.Any()
  }
}

const ForgotPasswordSchema = {
  body: emailUserSchema,
  response: {
    200: verifyAccountResponseSchema,
    401: errorResponseSchema,
    500: Type.Any()
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
    500: Type.Any()
  }
}

const AddProfilePictureSchema = {
  response: {
    200: verifyAccountResponseSchema,
    400: errorResponseSchema,
    500: Type.Any()
  }
}

const GetProfilePictureSchema = {
  response: {
    200: getProfilePictureResponseSchema,
    404: errorResponseSchema,
    500: Type.Any()
  }
}

type CreateUserInput = Static<typeof createUserSchema>
type CreateUserResponse = Static<typeof createUserResponseSchema>
type CreateUserHandlerResponse = Static<typeof createUserHandlerResponseSchema>
type LogInUserInput = Static<typeof logInUserSchema>
type LogInUserResponse = Static<typeof logInUserResponseSchema>
type EmailUserInput = Static<typeof emailUserSchema>
type UpdateUserStrictSchema = Required<Static<typeof updateUserSchema>>
type UpdateUserServiceInput = Static<typeof updateUserServiceSchema>
type VerifyAccountResponse = Static<typeof verifyAccountResponseSchema>
type UpdateSessionInput = Static<typeof updateSessionSchema>
type RefreshTokenResponse = Static<typeof refreshTokenResponseSchema>
type Gender = Static<typeof gender>
type Role = Static<typeof role>

export {
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
  ResetPasswordSchema,
  AddProfilePictureSchema,
  GetProfilePictureSchema,
  type CreateUserResponse,
  type CreateUserInput,
  type CreateUserHandlerResponse,
  type LogInUserInput,
  type LogInUserResponse,
  type EmailUserInput,
  type VerifyAccountResponse,
  type UpdateUserServiceInput,
  type UpdateUserStrictSchema,
  type UpdateSessionInput,
  type RefreshTokenResponse
}
