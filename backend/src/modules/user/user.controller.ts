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
    const { password, ...rest } = request.body

    const passwordHash = await request.bcryptHash(password)

    const user = await createUser({ ...rest, password: passwordHash })

    if (typeof user === 'undefined') throw new Error('createUser failure')

    return await reply.code(201).send(user)
  } catch (error) {
    console.log(error)
    return await reply.code(500).send(error)
  }
}

export {
  createUserHandler
}
