import { Static, Type } from '@fastify/type-provider-typebox'
import { regexObjectId } from '../user/user.schemas'

const adminAttributes = {
  id: Type.RegEx(regexObjectId),
  ids: Type.Array(Type.RegEx(regexObjectId)),
  message: Type.String()
}

const { id, message } = adminAttributes

const createAdminParamsSchema = Type.Object({
  id
})

const messageResponseSchema = Type.Object({
  message
})

const errorResponseSchema = Type.Object({
  message
})

const CreateAdminSchema = {
  params: createAdminParamsSchema,
  response: {
    201: messageResponseSchema,
    404: errorResponseSchema,
    500: Type.Unknown()
  }
}

type MessageResponseSchema = Static<typeof messageResponseSchema>

export {
  CreateAdminSchema,
  MessageResponseSchema
}
