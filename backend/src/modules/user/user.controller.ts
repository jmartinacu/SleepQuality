import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserInput, CreateUserResponseSchema } from './user.schemas'

async function createUserHandler (
  request: FastifyRequest<{
    Body: CreateUserInput
  }>,
  _reply: FastifyReply
):
  Promise<CreateUserResponseSchema> {
  const { password, ...rest } = request.body

  return { ...rest, BMI: 0, id: '0' }
}

export {
  createUserHandler
}
