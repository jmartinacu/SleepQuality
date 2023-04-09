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

const userExtent = {
  email: Type.String({ format: 'email' }),
  password: Type.RegEx(regexPassword),
  role: Type.Optional(
    Type.Union([
      Type.Literal('ADMIN'),
      Type.Literal('USER')
    ])),
  id: Type.String()
}

const { email, password, id } = userExtent

const { BMI, ...userCoreExceptBMI } = userCore

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

const logInUserSchema = Type.Object({
  email,
  password: Type.String({ minLength: 8, maxLength: 15 })
})

const logInUserResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String()
})

const findUserParamsSchema = Type.Object({
  id: Type.String()
})

const verifyAccountParamsSchema = Type.Object({
  id: Type.String(),
  verificationCode: Type.String()
})

const updateUserSchema = Type.Object({
  age: Type.Optional(userCoreExceptBMI.age),
  gender: Type.Optional(userCoreExceptBMI.gender),
  height: Type.Optional(userCoreExceptBMI.height),
  weight: Type.Optional(userCoreExceptBMI.weight),
  chronicDisorders: Type.Optional(userCoreExceptBMI.chronicDisorders),
  verified: Type.Optional(Type.Boolean())
})

const verifyAccountResponseSchema = Type.Object({
  message: Type.String()
})

type CreateUserInput = Static<typeof createUserSchema>
type CreateUserResponseSchema = Static<typeof createUserResponseSchema>
type LogInUserInput = Static<typeof logInUserSchema>
type LogInUserResponseSchema = Static<typeof logInUserResponseSchema>
type FindUserParamsSchema = Static<typeof findUserParamsSchema>
type VerifyAccountParamsSchema = Static<typeof verifyAccountParamsSchema>
type UpdateUserSchema = Static<typeof updateUserSchema>
type VerifyAccountResponseSchema = Static<typeof verifyAccountResponseSchema>

export {
  createUserSchema,
  createUserResponseSchema,
  logInUserSchema,
  logInUserResponseSchema,
  findUserParamsSchema,
  verifyAccountParamsSchema,
  verifyAccountResponseSchema,
  updateUserSchema,
  CreateUserResponseSchema,
  CreateUserInput,
  LogInUserInput,
  LogInUserResponseSchema,
  FindUserParamsSchema,
  VerifyAccountParamsSchema,
  VerifyAccountResponseSchema,
  UpdateUserSchema
}
