import type { FastifyRequestTypebox, FastifyReplyTypebox } from '../../server'
import { updateUser } from '../user/user.services'
import { CreateAdminSchema, MessageResponseSchema } from './admin.schemas'

async function createAdminHandler (
  request: FastifyRequestTypebox<typeof CreateAdminSchema>,
  reply: FastifyReplyTypebox<typeof CreateAdminSchema>
): Promise<MessageResponseSchema> {
  try {
    const { id } = request.params
    await updateUser(id, { role: 'ADMIN' })
    return await reply.code(201).send({ message: 'Admin created' })
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

export {
  createAdminHandler
}
