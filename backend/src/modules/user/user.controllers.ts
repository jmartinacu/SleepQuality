import fs, { type ReadStream } from 'node:fs'
import path from 'node:path'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type {
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
  deleteUser,
  findSessionAndUserUnique,
  findSessionUnique,
  findUserUnique,
  updateSession,
  updateUser
} from './user.services'
import sendEmail from '../../utils/mailer'
import type { Session, User } from '../../utils/database'
import {
  checkTimeDiffGivenDateUntilNow,
  getFileExtension,
  getMIMEType,
  htmlResetPasswordUser,
  htmlVerifyUser,
  random
} from '../../utils/helpers'

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

    const verificationLink = `${request.protocol}://${request.hostname}/api/users/verify/${user.id}/${user.verificationCode}`

    const html = htmlVerifyUser(verificationLink)

    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      html
    })

    return await reply.code(201).send(user)
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function deleteUserHandler (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { userId } = request.user as { userId: string }
    await deleteUser(userId)
    return await reply.code(204).send()
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

    const html = htmlResetPasswordUser(passwordResetCode)

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

async function addProfilePictureHandler (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<VerifyAccountResponse> {
  try {
    const { file: image } = request
    if (typeof image === 'undefined') {
      return await reply.code(404).send({ message: 'Incorrect image' })
    }
    const { filename: profilePicture } = image
    const { userId } = request.user as { userId: string }
    await updateUser(userId, { profilePicture })
    return await reply.send({ message: 'Profile Picture saved' })
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}
async function getProfilePictureHandler (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<ReadStream> {
  try {
    const { userId } = request.user as { userId: string }
    const { profilePicture } = await findUserUnique('id', userId) as User
    if (profilePicture === null) {
      return await reply.code(404).send({ message: 'No Profile Picture' })
    }
    const extension = getFileExtension(profilePicture)
    const MIMEType = getMIMEType(extension)
    const filePath = path.resolve(`images/${profilePicture}`)
    const fileStream = fs.createReadStream(filePath)
    return await reply.type(MIMEType).send(fileStream)
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

export {
  createUserHandler,
  deleteUserHandler,
  logInUserHandler,
  getMeHandler,
  verifyAccountHandler,
  refreshAccessTokenHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  addProfilePictureHandler,
  getProfilePictureHandler
}
