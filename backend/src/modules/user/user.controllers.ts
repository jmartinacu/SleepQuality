import fs, { type ReadStream } from 'node:fs'
import path from 'node:path'
import type {
  AcceptDoctorSchema,
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
  createUser,
  createUserSession,
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
import { errorCodeAndMessage } from '../../utils/error'

// CHECK EMAIL IS NOT IN DB
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

    const checkEmailIsUnique = await findUserUnique('email', rest.email)

    if (checkEmailIsUnique !== null) {
      return await reply.code(400).send({ message: `Email ${rest.email} is used by other user` })
    }

    const passwordHash = await request.bcryptHash(password)

    if (!checkBirth(rest.birth)) {
      return await reply.code(400).send({ message: 'Incorrect user birth' })
    }

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
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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
      const { id } = await createUserSession(userId)
      sessionId = id
    }
    const accessToken = await reply.accessSign({ userId })
    const refreshToken = await reply.refreshSign({ sessionId })
    return {
      accessToken,
      refreshToken
    }
  } catch (error) {
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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

    const passwordHash = await request.bcryptHash(password)

    await updateUser(user.id, { passwordResetCode: null, password: passwordHash })
    return await reply.send({ message: 'Password reset' })
  } catch (error) {
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
  }
}

async function acceptDoctorHandler (
  request: FastifyRequestTypebox<typeof AcceptDoctorSchema>,
  reply: FastifyReplyTypebox<typeof AcceptDoctorSchema>
): Promise<VerifyAccountResponse> {
  try {
    const { userId } = request.user as { userId: string }
    const { id: doctorId, doctorCode } = request.params
    const user = await findUserUnique('id', userId) as User
    console.log(`doctorCode ${doctorCode}, type ${typeof doctorCode}`)
    console.log(`Type doctorId: ${typeof user.doctorId}`)
    if (typeof user.doctorId !== 'undefined') {
      return await reply.code(403).send({ message: 'User already has a doctor' })
    }
    if (user.doctorCode !== Number(doctorCode)) {
      return await reply.code(403).send({ message: 'Doctor Code invalid' })
    }
    await updateUser(user.id, { doctorId })
    return await reply.send({ message: `Doctor ${doctorId} accepted` })
  } catch (error) {
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
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
  getProfilePictureHandler,
  acceptDoctorHandler
}
