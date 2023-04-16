import { FastifyReply, FastifyRequest } from 'fastify'
import {
  CreateUserInput,
  CreateUserResponse,
  ForgotPasswordInput,
  LogInUserResponse,
  RefreshTokenHeaderInput,
  RefreshTokenResponse,
  ResetPasswordBodyInput,
  ResetPasswordParamsInput,
  VerifyAccountParamsInput,
  VerifyAccountResponse
} from './user.schemas'
import {
  createSession,
  createUser,
  findSessionAndUserUnique,
  findSessionUnique,
  findUserUnique,
  updateSession,
  updateUser
} from './user.services'
import sendEmail from '../../utils/mailer'
import { Session, User } from '../../utils/database'
import { checkTimeDiffGivenDateUntilNow, random } from '../../utils/helpers'

async function createUserHandler (
  request: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply
): Promise<CreateUserResponse> {
  try {
    const { password, ...rest } = request.body

    const passwordHash = await request.bcryptHash(password)

    const user = await createUser({ ...rest, password: passwordHash })

    if (typeof user === 'undefined') throw new Error('Error while creating user')

    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      text: `Verification Code: ${user.verificationCode}. ID: ${user.id}`
    })

    return await reply.code(201).send(user)
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function logInUserHandler (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<LogInUserResponse> {
  try {
    const { userId } = request.user as { userId: string }
    let sessionId
    const session = await findSessionUnique('userId', userId)
    if (session !== null) {
      const { id } = await updateSession(session.id, { valid: true })
      sessionId = id
    } else {
      const newSession = await createSession(userId)
      sessionId = newSession.id
    }
    const accessToken = await reply.accessSign({ userId })
    const refreshToken = await reply.refreshSign({ sessionId })
    return {
      accessToken,
      refreshToken
    }
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function getMeHandler (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<CreateUserResponse> {
  try {
    const { userId } = request.user as { userId: string }
    const { user, valid } = await findSessionAndUserUnique('userId', userId) as Session & { user: User }
    if (!valid) {
      return await reply.code(401).send({ message: 'Session expired, please login' })
    }
    return await reply.send(user)
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function verifyAccountHandler (
  request: FastifyRequest<{
    Params: VerifyAccountParamsInput
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

async function refreshAccessTokenHandler (
  request: FastifyRequest<{
    Headers: RefreshTokenHeaderInput
  }>,
  reply: FastifyReply
): Promise<RefreshTokenResponse> {
  try {
    const jwtRefreshFunctionality = request.server.jwt.refresh
    const { refresh } = request.headers
    await jwtRefreshFunctionality.verify(refresh)
    const decodedRefreshToken = jwtRefreshFunctionality.decode(refresh)
    if (decodedRefreshToken === null) {
      return await reply.code(401).send({ message: 'Could not refresh Access Token' })
    }
    const { id, valid, updatedAt, userId } = await findSessionUnique('id', decodedRefreshToken.sessionId) as Session
    if (!valid) {
      return await reply.code(401).send({ message: 'Could not refresh Access Token' })
    }
    if (checkTimeDiffGivenDateUntilNow(updatedAt, 1)) {
      await updateSession(id, { valid: false })
      return await reply.code(400).send({ message: 'Refresh Token time limit exceeded, please login' })
    }
    const accessToken = await reply.accessSign({ userId })
    return {
      accessToken
    }
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function forgotPasswordHandler (
  request: FastifyRequest<{
    Body: ForgotPasswordInput
  }>,
  reply: FastifyReply): Promise<VerifyAccountResponse> {
  try {
    const { email } = request.body
    const { server } = request
    const message = `If user with email equal ${email} is registered, he will received an email to reset his password`
    const user = await findUserUnique('email', email)
    if (user === null) {
      return await reply.send({ message })
    }
    if (!user.verified) {
      return await reply.code(401).send({ message: 'User not verify, please verify you account' })
    }
    const passwordResetCode = random(10000, 99999)
    await updateUser(user.id, { passwordResetCode })
    const html = await server.view(
      'reset-password.template.hbs',
      { passwordResetCode }
    )
    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      html
    })
    return await reply.send({ message })
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function resetPasswordHandler (
  request: FastifyRequest<{
    Params: ResetPasswordParamsInput
    Body: ResetPasswordBodyInput
  }>,
  reply: FastifyReply
): Promise<VerifyAccountResponse> {
  try {
    const { id, passwordResetCode } = request.params
    const { password } = request.body
    const user = await findUserUnique('id', id)
    if (user === null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    if (!user.verified) {
      return await reply.code(401).send({ message: 'User not verify, please verify you account' })
    }
    if (user.passwordResetCode !== passwordResetCode) {
      return await reply.code(403).send({ message: 'Reset Code invalid' })
    }
    await updateUser(id, { passwordResetCode: null, password })
    return await reply.send({ message: 'Password reset' })
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

export {
  createUserHandler,
  logInUserHandler,
  getMeHandler,
  verifyAccountHandler,
  refreshAccessTokenHandler,
  forgotPasswordHandler,
  resetPasswordHandler
}
