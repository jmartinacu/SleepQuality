import { Static, Type } from '@sinclair/typebox'
import { User } from '../../utils/database'

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
  password
})

const logInUserResponseSchema = Type.Object({
  token: Type.String()
})

type CreateUserInput = Static<typeof createUserSchema>
type CreateUserResponseSchema = Static<typeof createUserResponseSchema>
type CreateUserResponseService = Omit<User, 'password'>
type LogInUserInput = Static<typeof logInUserSchema>
type LogInUserResponseSchema = Static<typeof logInUserResponseSchema>
type FindUserUniqueIdentifier = 'email' | 'id'

export {
  createUserSchema,
  createUserResponseSchema,
  logInUserSchema,
  logInUserResponseSchema,
  CreateUserResponseSchema,
  CreateUserInput,
  CreateUserResponseService,
  LogInUserInput,
  LogInUserResponseSchema,
  FindUserUniqueIdentifier
}
