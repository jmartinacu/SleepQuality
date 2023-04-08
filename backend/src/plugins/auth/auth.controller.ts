import { FastifyRequest, FastifyReply } from 'fastify'
import { LogInUserInput } from '../../modules/user/user.schemas'
import { findUserUnique } from '../../modules/user/user.services'

async function verifyEmailAndPasswordHandler (
  request: FastifyRequest<{
    Body: LogInUserInput
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { email, password } = request.body
    const user = await findUserUnique('email', email)
    if (user == null) {
      return await reply.code(401).send({ message: 'Email or password wrong' })
    }
    const passwordCheck = await request.bcryptCompare(password, user.password)
    if (!passwordCheck) {
      return await reply.code(401).send({ message: 'Email or password wrong' })
    }
    request.user = { id: user.id }
  } catch (error) {
    return await reply.send(error)
  }
}

export {
  verifyEmailAndPasswordHandler
}
