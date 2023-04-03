import { Static, Type } from '@sinclair/typebox'

enum GenderEnum {
  MASCULINE, FEMININE, NEUTER
}

const userCore = {
  age: Type.Integer(),
  gender: Type.Enum(GenderEnum),
  height: Type.Number(),
  weight: Type.Number(),
  chronicDisorders: Type.Array(Type.String()),
  BMI: Type.Number()
}

const { BMI, ...userCoreExceptBMI } = userCore

const createUserSchema = Type.Object({
  ...userCoreExceptBMI,
  email: Type.String({ format: 'email' }),
  password: Type.String()
})

const createUserResponseSchema = Type.Object({
  ...userCore,
  email: Type.String({ format: 'email' }),
  id: Type.String() // VOY A TENER PROBLEMAS CON ESTO PORQUE ESTO SERA EL TIPO QUE TIENE MONGODB EN SU ID.
})

type CreateUserInput = Static<typeof createUserSchema>
type CreateUserResponseSchema = Static<typeof createUserResponseSchema>

export {
  createUserSchema,
  createUserResponseSchema,
  CreateUserResponseSchema,
  CreateUserInput
}
