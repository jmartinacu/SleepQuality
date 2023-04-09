import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserInput, CreateUserResponseSchema, FindUserParamsSchema, LogInUserResponseSchema, VerifyAccountParamsSchema } from './user.schemas'
import { createSession, createUser, findUserUnique, updateUser } from './user.services'
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

async function logInUserHandler (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<LogInUserResponseSchema> {
  try {
    const { userId } = request.user as { userId: string }
    // MIRAR SI YA TIENE UNA SESIÓN CREADA EL USUARIO
    const { id: sessionId } = await createSession(userId)
    const accessToken = await reply.accessSign({ userId })
    const refreshToken = await reply.refreshSign({ sessionId })
    return {
      accessToken,
      refreshToken
    }
  } catch (error) {
    console.log(error)
    return await reply.code(500).send(error)
  }
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
    return await reply.send(user)
  } catch (error) {
    console.log(error)
    return await reply.code(500).send(error)
  }
}

async function verifyAccountHandler (
  request: FastifyRequest<{
    Params: VerifyAccountParamsSchema
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { id, verificationCode } = request.params
    const user = await findUserUnique('id', id)
    if (user === null) {
      return await reply.code(400).send({ message: 'Not Found' })
    }
    if (user.verified) {
      return await reply.send({ message: 'User already verified' })
    }
    if (user.verificationCode === verificationCode) {
      await updateUser(id, { verified: true })
      return await reply.send({ message: 'User verified' })
    }
    return await reply.code(400).send({ message: 'Could not verified User' })
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

export {
  createUserHandler,
  logInUserHandler,
  getUserHandler,
  verifyAccountHandler
}
