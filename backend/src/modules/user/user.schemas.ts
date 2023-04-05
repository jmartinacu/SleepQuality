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

const userExtent = {
  email: Type.String({ format: 'email' }),
  password: Type.String(),
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

type CreateUserInput = Static<typeof createUserSchema>
type CreateUserResponseSchema = Static<typeof createUserResponseSchema>
type createUserResponseService = Omit<User, 'password'>

export {
  createUserSchema,
  createUserResponseSchema,
  CreateUserResponseSchema,
  CreateUserInput,
  createUserResponseService
}
