import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserInput, CreateUserResponseSchema } from './user.schemas'
import { createUser } from './user.services'

async function createUserHandler (
  request: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply
): Promise<CreateUserResponseSchema> {
  try {
    const user = await createUser(request.body)

    return await reply.code(201).send(user)
  } catch (error) {
    console.log(error)
    return await reply.code(500).send(error)
  }
}

export {
  createUserHandler
}
