import { Static, Type } from '@fastify/type-provider-typebox'

const regexObjectId = /^[a-fA-F0-9]{24}$/

const adminAttributes = {
  id: Type.RegEx(regexObjectId),
  message: Type.String()
}

const { id, message } = adminAttributes

const createAdminParamsSchema = Type.Object({
  id
})

const messageResponseSchema = Type.Object({
  message
})

const CreateAdminSchema = {
  params: createAdminParamsSchema,
  response: {
    201: messageResponseSchema,
    500: Type.Any()
  }
}

type MessageResponseSchema = Static<typeof messageResponseSchema>

export {
  CreateAdminSchema,
  MessageResponseSchema
}
