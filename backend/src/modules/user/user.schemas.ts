import { Static, Type } from '@sinclair/typebox'

const userCore = {
  age: Type.Integer({ exclusiveMinimum: 0 }),
  gender: Type.Union([
    Type.Literal('MASCULINE'),
    Type.Literal('FEMININE'),
    Type.Literal('NEUTER')
  ]),
  height: Type.Integer({ exclusiveMinimum: 0 }),
  weight: Type.Number({ exclusiveMinimum: 0 }),
  chronicDisorders: Type.Array(Type.String()),
  BMI: Type.Number()
}

const userExtent = {
  email: Type.String({ format: 'email' }),
  password: Type.String(),
  id: Type.String() // VOY A TENER PROBLEMAS CON ESTO PORQUE ESTO SERA EL TIPO QUE TIENE MONGODB EN SU ID.
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

export {
  createUserSchema,
  createUserResponseSchema,
  CreateUserResponseSchema,
  CreateUserInput
}
