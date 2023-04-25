// CAMBIAR TYPEBOX POR ZOD PROBAR
import { Static, Type } from '@sinclair/typebox'

const userCore = {
  age: Type.Integer({ exclusiveMinimum: 0 }),
  gender: Type.Union([
    Type.Literal('MASCULINE'),
    Type.Literal('FEMININE'),
    Type.Literal('NEUTER')
  ]),
  height: Type.Number({ exclusiveMinimum: 0 }),
  weight: Type.Number({ exclusiveMinimum: 0 }),
  chronicDisorders: Type.Array(Type.String()),
  BMI: Type.Number()
}

const sessionCore = {
  valid: Type.Boolean(),
  userId: Type.String()
}

/*
PASSWORD REGEX RULES:
  Min 8 characters
  Max 15 characters
  At least one upper case letter
  At least one lower case letter
  At least one digit
  No empty spaces
  At least one special character
*/
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/
const regexObjectId = /^[a-fA-F0-9]{24}$/

const userExtent = {
  email: Type.String({ format: 'email' }),
  password: Type.RegEx(regexPassword),
  role: Type.Optional(
    Type.Union([
      Type.Literal('ADMIN'),
      Type.Literal('USER')
    ])),
  verificationCode: Type.String(),
  id: Type.RegEx(regexObjectId),
  profilePicture: Type.String()
}

const {
  email,
  password,
  id,
  verificationCode,
  role,
  profilePicture
} = userExtent

const { BMI, ...userCoreExceptBMI } = userCore

const { gender } = userCore

const createUserSchema = Type.Object({
  ...userCoreExceptBMI,
  email,
  password
})

const createUserResponseSchema = Type.Object({
  ...userCore,
  email,
  id
})

const createUserResponseHandlerSchema = Type.Object({
  ...userCore,
  email,
  id,
  verificationCode
})

const logInUserSchema = Type.Object({
  email,
  password: Type.String({ minLength: 8, maxLength: 15 })
})

const logInUserResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String()
})

const refreshTokenResponseSchema = Type.Object({
  accessToken: Type.String()
})
const findUserSchema = Type.Object({
  id
})

const verifyAccountParamsSchema = Type.Object({
  id,
  verificationCode: Type.String()
})

const resetPasswordParamsSchema = Type.Object({
  id,
  passwordResetCode: Type.Integer()
})

const resetPasswordBodySchema = Type.Object({
  password
})

const updateUserSchema = Type.Object({
  age: Type.Optional(userCoreExceptBMI.age),
  gender: Type.Optional(userCoreExceptBMI.gender),
  height: Type.Optional(userCoreExceptBMI.height),
  weight: Type.Optional(userCoreExceptBMI.weight),
  chronicDisorders: Type.Optional(userCoreExceptBMI.chronicDisorders),
  BMI: Type.Optional(BMI),
  verified: Type.Optional(Type.Boolean()),
  passwordResetCode: Type.Optional(Type.Union([
    Type.Integer(),
    Type.Null()
  ])),
  password: Type.Optional(Type.String()),
  profilePicture: Type.Optional(profilePicture)
})

const verifyAccountResponseSchema = Type.Object({
  message: Type.String()
})

const verificationErrorResponseSchema = Type.Object({
  message: Type.String()
})

const updateSessionSchema = Type.Object({
  valid: Type.Optional(sessionCore.valid),
  userId: Type.Optional(sessionCore.userId)
})

const refreshTokenHeaderSchema = Type.Object({
  refresh: Type.String()
})

const forgotPasswordSchema = Type.Object({
  email
})

type CreateUserInput = Static<typeof createUserSchema>
type CreateUserResponse = Static<typeof createUserResponseSchema>
type CreateUserResponseHandler = Static<typeof createUserResponseHandlerSchema>
type LogInUserInput = Static<typeof logInUserSchema>
type LogInUserResponse = Static<typeof logInUserResponseSchema>
type FindUserInput = Static<typeof findUserSchema>
type VerifyAccountParamsInput = Static<typeof verifyAccountParamsSchema>
type UpdateUserInput = Static<typeof updateUserSchema>
type VerifyAccountResponse = Static<typeof verifyAccountResponseSchema>
type UpdateSessionInput = Static<typeof updateSessionSchema>
type VerificationErrorResponse = Static<typeof verificationErrorResponseSchema>
type RefreshTokenHeaderInput = Static<typeof refreshTokenHeaderSchema>
type RefreshTokenResponse = Static<typeof refreshTokenResponseSchema>
type ForgotPasswordInput = Static<typeof forgotPasswordSchema>
type ResetPasswordParamsInput = Static<typeof resetPasswordParamsSchema>
type ResetPasswordBodyInput = Static<typeof resetPasswordBodySchema>
type Gender = Static<typeof gender>
type Role = Static<typeof role>

export {
  type Gender,
  type Role,
  createUserSchema,
  createUserResponseSchema,
  createUserResponseHandlerSchema,
  logInUserSchema,
  logInUserResponseSchema,
  findUserSchema,
  verifyAccountParamsSchema,
  verifyAccountResponseSchema,
  updateUserSchema,
  verificationErrorResponseSchema,
  refreshTokenHeaderSchema,
  refreshTokenResponseSchema,
  forgotPasswordSchema,
  resetPasswordParamsSchema,
  resetPasswordBodySchema,
  type ResetPasswordBodyInput,
  type ResetPasswordParamsInput,
  type CreateUserResponse,
  type CreateUserInput,
  type CreateUserResponseHandler,
  type LogInUserInput,
  type LogInUserResponse,
  type FindUserInput,
  type VerifyAccountParamsInput,
  type VerifyAccountResponse,
  type UpdateUserInput,
  type UpdateSessionInput,
  type VerificationErrorResponse,
  type RefreshTokenHeaderInput,
  type RefreshTokenResponse,
  type ForgotPasswordInput
}
