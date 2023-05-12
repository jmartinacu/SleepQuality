import { Static, Type } from '@fastify/type-provider-typebox'
import { regexObjectId } from '../user/user.schemas'

const adminAttributes = {
  id: Type.RegEx(regexObjectId),
  ids: Type.Array(Type.RegEx(regexObjectId)),
  message: Type.String()
}

const { id, ids, message } = adminAttributes

const createAdminParamsSchema = Type.Object({
  id
})

const createManyDoctorsBodySchema = Type.Object({
  ids
})

const messageResponseSchema = Type.Object({
  message
})

const errorResponseSchema = Type.Object({
  message
})

const CreateAdminDoctorSchema = {
  params: createAdminParamsSchema,
  response: {
    201: messageResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

const CreateManyDoctorsSchema = {
  body: createManyDoctorsBodySchema,
  response: {
    201: messageResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

type MessageResponseSchema = Static<typeof messageResponseSchema>

export {
  CreateAdminDoctorSchema,
  CreateManyDoctorsSchema,
  MessageResponseSchema
}
