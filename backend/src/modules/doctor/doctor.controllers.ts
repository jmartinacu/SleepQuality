import { ReadStream } from 'node:fs'
import path from 'node:path'
import AdmZip from 'adm-zip'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../server'
import { errorCodeAndMessage } from '../../utils/error'
import {
  LogInSchema,
  LogInUserResponse,
  RefreshTokenResponse,
  RefreshTokenSchema
} from '../user/user.schemas'
import {
  Answer,
  Session,
  QuestionnaireAlgorithm,
  Doctor,
  Questionnaire,
  User
} from '../../utils/database'
import {
  createDoctorSession,
  findSessionUnique,
  findUserUnique,
  updateSession,
  updateUser
} from '../user/user.services'
import {
  checkTimeDiffOfGivenDateUntilNow,
  htmlAddDoctor,
  parseDateToString,
  random
} from '../../utils/helpers'
import {
  AddDoctorToUserSchema,
  AddQuestionnairesToUserSchema,
  DeleteDoctorAuthenticatedSchema,
  DoctorResponse,
  GetDoctorAuthenticatedSchema,
  GetUserAlgorithmsSchema,
  GetUserAnswerSchema,
  GetUserInformationSchema,
  GetUserSchema,
  GetUsersImagesSchema,
  GetUsersSchema,
  MessageResponse
} from './doctor.schemas'
import {
  findAnswers,
  findLastAnswer,
  findLastQuestionnaireAlgorithms,
  findQuestionnaireAlgorithmsOrderByCreatedAt,
  findQuestionnaireMany,
  findQuestionnaireUnique
} from '../questionnaire/questionnaire.services'
import sendEmail from '../../utils/mailer'
import { deleteDoctor, findDoctorUnique, findUsersDoctor } from './doctor.services'
import { GetInformationResponseSchema, GetQuestionnaireSchema, GetQuestionnairesInformationSchema } from '../questionnaire/questionnaire.schemas'

async function logInDoctorHandler (
  request: FastifyRequestTypebox<typeof LogInSchema>,
  reply: FastifyReplyTypebox<typeof LogInSchema>
): Promise<LogInUserResponse> {
  try {
    const { doctorId } = request.user as { doctorId: string }
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
    const {
      id,
      valid,
      updatedAt,
      doctorId
    } = await findSessionUnique('id', sessionId) as Session
    if (!valid) {
      return await reply.code(401).send({ message: 'Could not refresh Access Token' })
    }
    if (checkTimeDiffOfGivenDateUntilNow(updatedAt, 1)) {
      await updateSession(id, { valid: false })
      return await reply.code(400).send({ message: 'Refresh Token time limit exceeded, please login' })
    }
    const accessToken = await reply.accessSign({ doctorId })
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

async function deleteDoctorHandler (
  request: FastifyRequestTypebox<typeof DeleteDoctorAuthenticatedSchema>,
  reply: FastifyReplyTypebox<typeof DeleteDoctorAuthenticatedSchema>
): Promise<void> {
  try {
    const { userId: doctorId } = request.user as { userId: string }
    await deleteDoctor(doctorId)
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

async function addQuestionnaireToUserHandler (
  request: FastifyRequestTypebox<typeof AddQuestionnairesToUserSchema>,
  reply: FastifyReplyTypebox<typeof AddQuestionnairesToUserSchema>
): Promise<MessageResponse> {
  try {
    const { doctorId } = request.user as { doctorId: string }
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
    const questionnairesToDo = questionnaireIds
      .filter(questionnaireId => !user.questionnairesToDo.includes(questionnaireId))
    await updateUser(userId, { questionnairesToDo })
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

async function getDoctorAuthenticatedHandler (
  request: FastifyRequestTypebox<typeof GetDoctorAuthenticatedSchema>,
  reply: FastifyReplyTypebox<typeof GetDoctorAuthenticatedSchema>
): Promise<DoctorResponse> {
  try {
    const { doctorId } = request.user as { doctorId: string }
    const doctor = await findDoctorUnique('id', doctorId) as Doctor
    const { birth, ...rest } = doctor
    return await reply.send({
      ...rest,
      birth: parseDateToString(birth)
    })
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
    const { doctorId } = request.user as { doctorId: string }
    const { email } = request.params
    const user = await findUserUnique('email', email)
    if (user === null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    const doctorCode = random(10000, 99999)
    await updateUser(user.id, {
      acceptDoctor: {
        code: doctorCode,
        id: doctorId
      }
    })

    const html = htmlAddDoctor(user.id, doctorCode)

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

async function GetUserAnswersHandler (
  request: FastifyRequestTypebox<typeof GetUserAnswerSchema>,
  reply: FastifyReplyTypebox<typeof GetUserAnswerSchema>
): Promise<Answer | Answer[]> {
  try {
    const { doctorId } = request.user as { doctorId: string }
    const { userId, questionnaireId } = request.params
    const { all } = request.query
    console.log(all)
    let answer: Answer | Answer[] | null
    const user = await findUserUnique('id', userId)
    if (user === null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    const doctorUsers = await findUsersDoctor('id', doctorId)
    if (!doctorUsers.some(user => user.doctorId === userId)) {
      return await reply.code(403).send({ message: `Not enough privileges over user ${userId}` })
    }
    if (typeof all === 'undefined' || !all) {
      answer = await findAnswers(questionnaireId, userId)
    } else answer = await findLastAnswer(questionnaireId, userId)

    if (answer === null) {
      return await reply.send({ message: `The user ${userId} has never completed the questionnaire ${questionnaireId} ` })
    }
    return await reply.send(answer)
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

async function GetUserAlgorithmsHandler (
  request: FastifyRequestTypebox<typeof GetUserAlgorithmsSchema>,
  reply: FastifyReplyTypebox<typeof GetUserAlgorithmsSchema>
): Promise<QuestionnaireAlgorithm | QuestionnaireAlgorithm[]> {
  try {
    const { doctorId } = request.user as { doctorId: string }
    const { userId, questionnaireId } = request.params
    const { all } = request.query
    let algorithms: QuestionnaireAlgorithm | QuestionnaireAlgorithm[] | null
    const user = await findUserUnique('id', userId)
    if (user === null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    const doctorUsers = await findUsersDoctor('id', doctorId)
    if (!doctorUsers.some(user => user.doctorId === userId)) {
      return await reply.code(403).send({ message: `Not enough privileges over user ${userId}` })
    }
    if (typeof all === 'undefined' || !all) {
      algorithms = await findQuestionnaireAlgorithmsOrderByCreatedAt(userId, questionnaireId)
    } else algorithms = await findLastQuestionnaireAlgorithms(userId, questionnaireId)

    if (algorithms === null) {
      return await reply.send({ message: `The user ${userId} does not have algorithms of the questionnaire ${questionnaireId} ` })
    }
    return await reply.send(algorithms)
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

async function getUserInformationHandler (
  request: FastifyRequestTypebox<typeof GetUserInformationSchema>,
  reply: FastifyReplyTypebox<typeof GetUserInformationSchema>
): Promise<
  Answer |
  Answer[] |
  QuestionnaireAlgorithm |
  QuestionnaireAlgorithm[] |
  GetInformationResponseSchema
  > {
  try {
    const { doctorId } = request.user as { doctorId: string }
    const { userId, questionnaireId } = request.params
    const { all, info } = request.query
    let result: Answer |
    Answer[] |
    QuestionnaireAlgorithm |
    QuestionnaireAlgorithm[] |
    GetInformationResponseSchema |
    null = []
    const user = await findUserUnique('id', userId)
    if (user === null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    const doctorUsers = await findUsersDoctor('id', doctorId)
    if (!doctorUsers.some(user => user.doctorId === userId)) {
      return await reply.code(403).send({ message: `Not enough privileges over user ${userId}` })
    }
    if (info === 'algorithms') {
      if (typeof all === 'undefined' || all) {
        result = await findQuestionnaireAlgorithmsOrderByCreatedAt(userId, questionnaireId)
      } else {
        result = await findLastQuestionnaireAlgorithms(userId, questionnaireId)
        if (result === null) {
          return await reply.send({ message: `The user ${userId} does not have algorithms of the questionnaire ${questionnaireId} ` })
        }
      }
    } else if (info === 'answers') {
      if (typeof all === 'undefined' || all) {
        result = await findAnswers(questionnaireId, userId)
      } else {
        result = await findLastAnswer(questionnaireId, userId)
        if (result === null) {
          return await reply.send({ message: `The user ${userId} has never completed the questionnaire ${questionnaireId} ` })
        }
      }
    } else {
      if (typeof all === 'undefined' || all) {
        const algorithms = await findQuestionnaireAlgorithmsOrderByCreatedAt(userId, questionnaireId)
        const answers = await findAnswers(questionnaireId, userId)
        result = {
          answers,
          algorithms
        }
      } else {
        const answer = await findLastAnswer(questionnaireId, userId)
        const algorithm = await findLastQuestionnaireAlgorithms(userId, questionnaireId)
        if (answer === null && algorithm === null) {
          return await reply.send({ message: `The user ${userId} has never completed the questionnaire ${questionnaireId} ` })
        }
        result = {
          answers: answer,
          algorithms: algorithm
        }
      }
    }

    return await reply.send(result)
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

async function getQuestionnairesHandler (
  _request: FastifyRequestTypebox<typeof GetQuestionnairesInformationSchema>,
  reply: FastifyReplyTypebox<typeof GetQuestionnairesInformationSchema>
): Promise<Questionnaire[]> {
  try {
    const questionnaires = await findQuestionnaireMany('all', [])
    return await reply.send(questionnaires)
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

async function getQuestionnaireHandler (
  request: FastifyRequestTypebox<typeof GetQuestionnaireSchema>,
  reply: FastifyReplyTypebox<typeof GetQuestionnaireSchema>
): Promise<Questionnaire> {
  try {
    const { id } = request.params
    const questionnaire = await findQuestionnaireUnique('id', id)
    if (questionnaire === null) {
      return await reply.code(404).send({ message: 'Questionnaire not found' })
    }
    return await reply.send(questionnaire)
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

async function getUsersHandler (
  request: FastifyRequestTypebox<typeof GetUsersSchema>,
  reply: FastifyReplyTypebox<typeof GetUsersSchema>
): Promise<User[]> {
  try {
    const { doctorId } = request.user as { doctorId: string }
    const users = await findUsersDoctor('id', doctorId)
    return await reply.send(users)
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

async function getUsersImagesHandler (
  request: FastifyRequestTypebox<typeof GetUsersImagesSchema>,
  reply: FastifyReplyTypebox<typeof GetUsersImagesSchema>
): Promise<ReadStream[]> {
  try {
    const { doctorId } = request.user as { doctorId: string }
    const users = await findUsersDoctor('id', doctorId)
    const zip = new AdmZip()
    users.filter(user => user.profilePicture !== null)
      .forEach(user => {
        const filename = user.profilePicture as string
        const filePath = path.resolve(`images/${filename}`)
        zip.addLocalFile(filePath)
      })
    const zipBuffer = zip.toBuffer()
    return await reply.type('application/zip').send(zipBuffer)
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

async function getUserHandler (
  request: FastifyRequestTypebox<typeof GetUserSchema>,
  reply: FastifyReplyTypebox<typeof GetUserSchema>
): Promise<User> {
  try {
    const { doctorId } = request.user as { doctorId: string }
    const { id } = request.params
    const users = await findUsersDoctor('id', doctorId)
    const user = users.find(user => user.id === id)
    if (typeof user === 'undefined') {
      return await reply.code(404).send({ message: 'User not found' })
    }
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

export {
  logInDoctorHandler,
  refreshAccessTokenHandler,
  deleteDoctorHandler,
  addQuestionnaireToUserHandler,
  addDoctorToUserHandler,
  GetUserAnswersHandler,
  GetUserAlgorithmsHandler,
  getUserInformationHandler,
  getDoctorAuthenticatedHandler,
  getQuestionnairesHandler,
  getQuestionnaireHandler,
  getUsersHandler,
  getUserHandler,
  getUsersImagesHandler
}
