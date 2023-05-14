import fs, { type ReadStream } from 'node:fs'
import path from 'node:path'
import type {
  AddProfilePictureSchema,
  CreateUserResponse,
  CreateUserSchema,
  DeleteUserAuthenticatedSchema,
  ForgotPasswordSchema,
  GetProfilePictureSchema,
  GetUserAuthenticatedSchema,
  LogInSchema,
  LogInUserResponse,
  RefreshTokenResponse,
  RefreshTokenSchema,
  ResetPasswordSchema,
  UpdateUserAuthenticatedSchema,
  VerifyAccountResponse,
  VerifyUserSchema
} from './user.schemas'
import {
  createSession,
  createUser,
  deleteUser,
  findSessionUnique,
  findUserUnique,
  updateSession,
  updateUser
} from './user.services'
import sendEmail from '../../utils/mailer'
import type { Session, User } from '../../utils/database'
import {
  checkBirth,
  checkTimeDiffOfGivenDateUntilNow,
  getFileExtension,
  getMIMEType,
  htmlResetPasswordUser,
  htmlVerifyUser,
  random
} from '../../utils/helpers'
import type { FastifyRequestTypebox, FastifyReplyTypebox } from '../../server'

async function createUserHandler (
  request: FastifyRequestTypebox<typeof CreateUserSchema>,
  reply: FastifyReplyTypebox<typeof CreateUserSchema>
): Promise<CreateUserResponse> {
  try {
    const { password, ...rest } = request.body

    const restOfData = {
      birth: rest.birth,
      chronicDisorders: rest.chronicDisorders,
      email: rest.email,
      gender: rest.gender,
      height: rest.height,
      name: rest.name,
      weight: rest.weight
    }

    const passwordHash = await request.bcryptHash(password)

    if (!checkBirth(rest.birth)) {
      return await reply.code(400).send({ message: 'Incorrect user birth' })
    }

    // TENGO QUE CAMBIAR EL MES POR EL DIA PARA QUE LO HAGA BIEN
    const [day, month, year] = rest.birth.split('/')

    const newStringDate = `${month}/${day}/${year}`

    restOfData.birth = newStringDate

    const user = await createUser({ ...restOfData, password: passwordHash })

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
  request: FastifyRequestTypebox<typeof DeleteUserAuthenticatedSchema>,
  reply: FastifyReplyTypebox<typeof DeleteUserAuthenticatedSchema>
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

async function updateUserHandler (
  request: FastifyRequestTypebox<typeof UpdateUserAuthenticatedSchema>,
  reply: FastifyReplyTypebox<typeof UpdateUserAuthenticatedSchema>
): Promise<VerifyAccountResponse> {
  try {
    const { userId } = request.user as { userId: string }
    const data = request.body
    await updateUser(userId, data)
    return await reply.send({ message: 'User updated' })
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function logInUserHandler (
  request: FastifyRequestTypebox<typeof LogInSchema>,
  reply: FastifyReplyTypebox<typeof LogInSchema>
): Promise<LogInUserResponse> {
  try {
    const { userId } = request.user as { userId: string }
    let sessionId
    const session = await findSessionUnique('userId', userId)
    if (session !== null) {
      const { id } = await updateSession(session.id, { valid: true })
      sessionId = id
    } else {
      const { id } = await createSession(userId)
      sessionId = id
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
  request: FastifyRequestTypebox<typeof GetUserAuthenticatedSchema>,
  reply: FastifyReplyTypebox<typeof GetUserAuthenticatedSchema>
): Promise<CreateUserResponse> {
  try {
    const { userId } = request.user as { userId: string }
    const user = await findUserUnique('id', userId) as User
    return await reply.send(user)
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function verifyAccountHandler (
  request: FastifyRequestTypebox<typeof VerifyUserSchema>,
  reply: FastifyReplyTypebox<typeof VerifyUserSchema>
): Promise<void> {
  try {
    const { id, verificationCode } = request.params
    const user = await findUserUnique('id', id)
    if (user === null) {
      return await reply.code(404).send({ message: 'Not Found' })
    }
    if (user.verified) {
      return await reply.send({ message: 'User already verified' })
    }
    if (user.verificationCode === verificationCode) {
      await updateUser(id, { verified: true })
      return await reply.send({ message: 'User verified' })
    }
    return await reply.code(400).send({ message: 'Could not verified user' })
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function refreshAccessTokenHandler (
  request: FastifyRequestTypebox<typeof RefreshTokenSchema>,
  reply: FastifyReplyTypebox<typeof RefreshTokenSchema>
): Promise<RefreshTokenResponse> {
  try {
    const jwtRefreshFunctionality = request.server.jwt.refresh
    const { refresh } = request.headers
    await jwtRefreshFunctionality.verify(refresh)
    const { sessionId } = jwtRefreshFunctionality.decode(refresh) as { sessionId: string }
    const { id, valid, updatedAt, userId } = await findSessionUnique('id', sessionId) as Session
    if (!valid) {
      return await reply.code(401).send({ message: 'Could not refresh Access Token' })
    }
    if (checkTimeDiffOfGivenDateUntilNow(updatedAt, 1)) {
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
  request: FastifyRequestTypebox<typeof ForgotPasswordSchema>,
  reply: FastifyReplyTypebox<typeof ForgotPasswordSchema>
): Promise<VerifyAccountResponse> {
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
  request: FastifyRequestTypebox<typeof ResetPasswordSchema>,
  reply: FastifyReplyTypebox<typeof ResetPasswordSchema>
): Promise<VerifyAccountResponse> {
  try {
    const { passwordResetCode } = request.params
    const { password, email } = request.body
    const user = await findUserUnique('email', email)
    if (user === null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    if (!user.verified) {
      return await reply.code(401).send({ message: 'User not verify, please verify you account' })
    }
    if (user.passwordResetCode !== Number(passwordResetCode)) {
      return await reply.code(403).send({ message: 'Reset Code invalid' })
    }
    await updateUser(user.id, { passwordResetCode: null, password })
    return await reply.send({ message: 'Password reset' })
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function addProfilePictureHandler (
  request: FastifyRequestTypebox<typeof AddProfilePictureSchema>,
  reply: FastifyReplyTypebox<typeof AddProfilePictureSchema>
): Promise<VerifyAccountResponse> {
  try {
    const { file: image } = request
    if (typeof image === 'undefined') {
      return await reply.code(400).send({ message: 'Incorrect image' })
    }
    const { filename: profilePicture } = image
    const { userId } = request.user as { userId: string }
    const { profilePicture: profilePictureUser } = await findUserUnique('id', userId) as User
    // TENGO QUE MIRAR SI AUNQUE SALTE ESTO MULTER AÑADE LA IMAGEN AL DIRECTORIO IMAGES
    if (profilePictureUser !== null) {
      return await reply.code(403).send({ message: 'User already has an profile picture' })
    }
    await updateUser(userId, { profilePicture })
    return await reply.send({ message: 'Profile Picture saved' })
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}
async function getProfilePictureHandler (
  request: FastifyRequestTypebox<typeof GetProfilePictureSchema>,
  reply: FastifyReplyTypebox<typeof GetProfilePictureSchema>
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
  updateUserHandler,
  logInUserHandler,
  getMeHandler,
  verifyAccountHandler,
  refreshAccessTokenHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  addProfilePictureHandler,
  getProfilePictureHandler
}
