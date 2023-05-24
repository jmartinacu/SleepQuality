import type { FastifyRequest, FastifyReply } from 'fastify'
import type { EmailUserInput, IdsUserInput, LogInUserInput } from '../../modules/user/user.schemas'
import type {
  File,
  FileDestinationCallback,
  FileFilterCallback,
  FileNameCallback
} from '../types.plugins'
import {
  findSessionUnique,
  findUserMany,
  findUserUnique
} from '../../modules/user/user.services'
import type { Doctor, User } from '../../utils/database'
import { getFileExtension, checkFileExtension } from '../../utils/helpers'
import { findDoctorUnique } from '../../modules/doctor/doctor.services'
import { ValidationError, errorCodeAndMessage } from '../../utils/error'

async function verifyAuthorizationHeader (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.accessVerify()
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

async function verifyEmailAndPasswordHandler (
  request: FastifyRequest<{
    Body: LogInUserInput
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const [, , secondUrlParam] = request.url.split('/')
    const { email, password } = request.body

    let check: User | Doctor | null
    if (secondUrlParam === 'users') {
      check = await findUserUnique('email', email)
    } else if (secondUrlParam === 'doctors') {
      check = await findDoctorUnique('email', email)
    } else {
      throw new ValidationError(
        'Something went wrong',
        'checkEmailAndPassword',
        `URL: ${request.url} is not /api/users or /api/doctors`,
        500
      )
    }
    if (check === null) {
      return await reply.code(401).send({ message: 'Email or password wrong' })
    }
    const passwordCheck = await request.bcryptCompare(password, check.password)
    if (!passwordCheck) {
      return await reply.code(401).send({ message: 'Email or password wrong' })
    }
    request.user = { userId: check.id }
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

async function userVerifiedWithoutAuthorization (
  request: FastifyRequest<{
    Body: EmailUserInput
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { email } = request.body
    const user = await findUserUnique('email', email)
    if (user === null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    if (!user.verified) {
      return await reply.code(401).send({ message: 'Please verify your account' })
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

async function usersVerified (
  request: FastifyRequest<{
    Body: IdsUserInput
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { ids } = request.body
    const users = await findUserMany('id', ids)
    if (users.length !== ids.length) {
      return await reply.code(404).send({ message: 'Users not found' })
    }
    if (users.some(user => !user.verified)) {
      return await reply.code(401).send({ message: 'Please verify users' })
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

async function doctorVerified (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { userId: doctorId } = request.user
    if (typeof doctorId === 'undefined') {
      return await reply.code(401).send({ message: 'Please login your account' })
    }
    const doctor = await findDoctorUnique('id', doctorId) as Doctor
    if (!doctor.verified) {
      return await reply.code(401).send({ message: 'Please verify your account' })
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

async function doctorVerifiedWithoutAuthorization (
  request: FastifyRequest<{
    Body: EmailUserInput
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { email } = request.body
    const doctor = await findDoctorUnique('email', email)
    if (doctor === null) {
      return await reply.code(404).send({ message: 'Doctor not found' })
    }
    if (!doctor.verified) {
      return await reply.code(401).send({ message: 'Please verify your account' })
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

function fileFilter (
  _request: FastifyRequest,
  file: File,
  cb: FileFilterCallback
): void {
  const extension = getFileExtension(file.originalname)
  if (extension === '') {
    cb(new Error('Incorrect file'))
  } else {
    cb(null, checkFileExtension(extension))
  }
}

function destination (
  _request: FastifyRequest,
  _file: File,
  cb: FileDestinationCallback
): void {
  cb(null, 'images/')
}

function filename (
  request: FastifyRequest,
  file: File,
  cb: FileNameCallback
): void {
  const { userId } = request.user as { userId: string }
  const { originalname, fieldname } = file
  const extension = getFileExtension(originalname)
  cb(null, `${fieldname}-${userId}-${Date.now()}.${extension}`)
}

export {
  verifyAuthorizationHeader,
  verifyEmailAndPasswordHandler,
  userVerifiedWithoutAuthorization,
  userVerified,
  usersVerified,
  doctorVerified,
  doctorVerifiedWithoutAuthorization,
  isAdmin,
  verifySession,
  fileFilter,
  destination,
  filename
}
