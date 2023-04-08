import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserInput, CreateUserResponseSchema, FindUserParamsSchema, LogInUserResponseSchema } from './user.schemas'
import { createUser, findUserUnique } from './user.services'
import sendEmail from '../../utils/mailer'

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

    if (typeof user === 'undefined') throw new Error('Error while creating user')

    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      text: 'NodeMailer funciona en nuestra app'
    })

    return await reply.code(201).send(user)
  } catch (error) {
    console.log(error)
    return await reply.code(500).send(error)
  }
}

function logInUserHandler (
  request: FastifyRequest,
  _reply: FastifyReply
): LogInUserResponseSchema {
  const { id } = request.user
  const server = request.server
  return { token: server.jwt.sign({ id }) }
}

async function getUserHandler (
  request: FastifyRequest<{
    Params: FindUserParamsSchema
  }>,
  reply: FastifyReply
): Promise<CreateUserResponseSchema> {
  try {
    const { id } = request.params
    const user = await findUserUnique('id', id)
    return await reply.code(200).send(user)
  } catch (error) {
    console.log(error)
    return await reply.send(error)
  }
}

export {
  createUserHandler,
  logInUserHandler,
  getUserHandler
}
