import { FastifyRequest, FastifyReply } from 'fastify'
import { LogInUserInput } from '../modules/user/user.schemas'
import { findUserUniqueOrThrow } from '../modules/user/user.services'

async function verifyEmailAndPasswordHandler (
  request: FastifyRequest<{
    Body: LogInUserInput
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { email, password } = request.body
    const user = await findUserUniqueOrThrow('email', email)
    const passwordCheck = await request.bcryptCompare(password, user.password)
    if (!passwordCheck) throw new Error('Wrong password')
  } catch (error) {
    return await reply.send(error)
  }
}

export {
  verifyEmailAndPasswordHandler
}
