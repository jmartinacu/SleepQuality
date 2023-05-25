import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../server'
import { errorCodeAndMessage } from '../../utils/error'
import {
  LogInSchema,
  LogInUserResponse,
  RefreshTokenResponse,
  RefreshTokenSchema
} from '../user/user.schemas'
import {
  Session
} from '../../utils/database'
import {
  createDoctorSession,
  findSessionUnique,
  findUserUnique,
  updateSession,
  updateUser
} from '../user/user.services'
import { checkTimeDiffOfGivenDateUntilNow, htmlAddDoctor, random } from '../../utils/helpers'
import { AddDoctorToUserSchema, AddQuestionnairesToUserSchema, MessageResponse } from './doctor.schemas'
import { findQuestionnaireMany } from '../questionnaire/questionnaire.services'
import sendEmail from '../../utils/mailer'

async function logInDoctorHandler (
  request: FastifyRequestTypebox<typeof LogInSchema>,
  reply: FastifyReplyTypebox<typeof LogInSchema>
): Promise<LogInUserResponse> {
  try {
    const { userId: doctorId } = request.user as { userId: string }
    let sessionId
    const session = await findSessionUnique('doctorId', doctorId)
    if (session !== null) {
      const { id } = await updateSession(session.id, { valid: true })
      sessionId = id
    } else {
      const { id } = await createDoctorSession(doctorId)
      sessionId = id
    }
    const accessToken = await reply.accessSign({ doctorId })
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

async function addQuestionnaireToUserHandler (
  request: FastifyRequestTypebox<typeof AddQuestionnairesToUserSchema>,
  reply: FastifyReplyTypebox<typeof AddQuestionnairesToUserSchema>
): Promise<MessageResponse> {
  try {
    const { userId: doctorId } = request.user as { userId: string }
    const { id: userId } = request.params
    const { questionnaires: questionnaireIds } = request.body
    const user = await findUserUnique('id', userId)
    if (user === null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    const questionnaires = await findQuestionnaireMany('id', questionnaireIds)
    if (questionnaireIds.length !== questionnaires.length) {
      return await reply.code(404).send({ message: 'Questionnaire not found' })
    }
    if (user.doctorId !== doctorId) {
      return await reply.code(403).send({ message: `Doctor ${doctorId} does not have enough privileges over user ${userId}` })
    }
    await updateUser(userId, { questionnairesToDo: questionnaireIds })
    return await reply.send({ message: `Questionnaires added to user ${userId}` })
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

async function addDoctorToUserHandler (
  request: FastifyRequestTypebox<typeof AddDoctorToUserSchema>,
  reply: FastifyReplyTypebox<typeof AddDoctorToUserSchema>
): Promise<MessageResponse> {
  try {
    const { id: userId } = request.params
    const user = await findUserUnique('id', userId)
    if (user === null) {
      return await reply.code(404).send({ message: 'User not found' })
    }

    const doctorCode = random(10000, 99999)
    await updateUser(user.id, { doctorCode })

    const html = htmlAddDoctor(doctorCode)

    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      html
    })

    return await reply.send({ message: `User with email ${user.email} has received an email to accept you as his doctor` })
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
  logInDoctorHandler,
  refreshAccessTokenHandler,
  addQuestionnaireToUserHandler,
  addDoctorToUserHandler
}
