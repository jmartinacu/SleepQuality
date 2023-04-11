import { FastifyRequest, FastifyReply } from 'fastify'
import { LogInUserInput } from '../../modules/user/user.schemas'
import {
  findSessionUnique,
  findUserUnique
} from '../../modules/user/user.services'
import { User } from '@prisma/client'

async function verifyAuthorizationHeader (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.accessVerify()
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function verifyEmailAndPasswordHandler (
  request: FastifyRequest<{
    Body: LogInUserInput
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { email, password } = request.body
    const user = await findUserUnique('email', email)
    if (user === null) {
      return await reply.code(401).send({ message: 'Email or password wrong' })
    }
    const passwordCheck = await request.bcryptCompare(password, user.password)
    if (!passwordCheck) {
      return await reply.code(401).send({ message: 'Email or password wrong' })
    }
    request.user = { userId: user.id }
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function userVerified (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { userId } = request.user
    if (typeof userId === 'undefined') {
      return await reply.code(401).send({ message: 'Please login your account' })
    }
    const user = await findUserUnique('id', userId) as User
    if (!user.verified) {
      return await reply.code(401).send({ message: 'Please verify your account' })
    }
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function isAdmin (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { userId: adminId } = request.user
    if (typeof adminId === 'undefined') {
      return await reply.code(400).send({ message: 'Please login your account' })
    }
    const user = await findUserUnique('id', adminId) as User
    if (user.role !== 'ADMIN') {
      return await reply.code(403).send({ message: 'Not enough privileges' })
    }
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function verifySession (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { userId } = request.user
    if (typeof userId === 'undefined') {
      return await reply.code(401).send({ message: 'Please login you account' })
    }
    const session = await findSessionUnique('userId', userId)
    if (session === null) {
      return await reply.code(401).send({ message: 'Please login you account' })
    }
    if (!session.valid) {
      return await reply.code(401).send({ message: 'Invalid session. Please login' })
    }
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

export {
  verifyAuthorizationHeader,
  verifyEmailAndPasswordHandler,
  userVerified,
  isAdmin,
  verifySession
}
