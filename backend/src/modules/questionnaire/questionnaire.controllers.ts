import {
  CreateQuestionnaireSchema,
  CreateAnswerSchema,
  type Questions,
  type AdditionalInformation,
  GetQuestionnaireSchema,
  GetLastAlgorithmSchema,
  GetAlgorithmSchema,
  GetDefaultAlgorithmInformationSchema,
  DefaultAlgorithmInformation,
  GetQuestionnairesInformationSchema
} from './questionnaire.schemas'
import { Answer, Questionnaire, QuestionnaireAlgorithm, User } from '../../utils/database'
import {
  createAnswer,
  createQuestionnaire,
  findQuestionnaireAlgorithmsOrderByCreatedAt,
  findQuestionnaireUnique,
  findQuestionnaireMany
} from './questionnaire.services'
import type { FastifyRequestTypebox, FastifyReplyTypebox } from '../../server'
import {
  checkAnswerTypes,
  checkAnswersEnums,
  convertToCorrectType
} from '../../utils/helpers'
import { errorCodeAndMessage } from '../../utils/error'
import { findUserUnique, updateUser } from '../user/user.services'

async function createQuestionnaireHandler (
  request: FastifyRequestTypebox<typeof CreateQuestionnaireSchema>,
  reply: FastifyReplyTypebox<typeof CreateQuestionnaireSchema>
): Promise<Questionnaire> {
  try {
    const data = request.body
    const questionnaire = await createQuestionnaire(data)
    return await reply.code(201).send(questionnaire)
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
      return await reply.code(404).send({ message: 'Not found' })
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

// TODO: NO MANDAR CUESTIONARIOS QUE YA ESTAN HECHOS
async function getUserQuestionnairesInformationHandler (
  request: FastifyRequestTypebox<typeof GetQuestionnairesInformationSchema>,
  reply: FastifyReplyTypebox<typeof GetQuestionnairesInformationSchema>
): Promise<Questionnaire[]> {
  try {
    const { userId } = request.user as { userId: string }
    const { questionnairesToDo } = await findUserUnique('id', userId) as User
    const questionnaires = await findQuestionnaireMany('id', questionnairesToDo)
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

async function createAnswerHandler (
  request: FastifyRequestTypebox<typeof CreateAnswerSchema>,
  reply: FastifyReplyTypebox<typeof CreateAnswerSchema>
): Promise<Answer> {
  try {
    const { userId } = request.user as { userId: string }
    const { answers, name } = request.body
    const server = request.server
    const questionnaire = await findQuestionnaireUnique('name', name)
    const { questionnairesToDo } = await findUserUnique('id', userId) as User
    if (questionnaire === null) {
      return await reply.code(400).send({
        message: `Questionnaire ${name} does not exist`
      })
    }
    if (!questionnairesToDo.includes(questionnaire.id)) {
      return await reply.code(400).send({
        message: `User ${userId} doesn't have to do questionnaire ${name}`
      })
    }
    // CHECK THAT THE QUESTIONS IN QUESTIONNAIRE AND THE QUESTIONS IN ANSWER ARE THE SAME
    if (JSON.stringify(Object.keys(questionnaire.questions as object)) !== JSON.stringify(Object.keys(answers))) {
      return await reply.code(400).send({ message: 'Answer does not have the right questions or answer questions are not in the correct order' })
    }
    // CHECK TYPES OF EACH ANSWER AND CHECK ENUM ANSWER QUESTIONS RESPONSES
    const questionIndexesToCheckEnums = (questionnaire.additionalInformation as AdditionalInformation)
      .reduce((accumulator, current) => {
        if ('enum' in current) {
          current.questions.forEach(questionIndexes => accumulator.add(questionIndexes))
        }
        return accumulator
      }, new Set<number>())
    let index = 0
    for (const [question, questionType] of Object.entries(questionnaire.questions as Questions)) {
      let answerUser = answers[question]
      if (!checkAnswerTypes[questionType](answerUser)) {
        return await reply.code(400).send({ message: 'Answer responses does no have the right types' })
      }
      answerUser = convertToCorrectType[questionType](answerUser)
      if (
        !(
          (
            questionType === 'SECONDARY_BOOL' ||
            questionType === 'SECONDARY_NUMBER' ||
            questionType === 'SECONDARY_TEXT'
          ) &&
          answerUser === null
        ) &&
        questionIndexesToCheckEnums.has(index) &&
        !checkAnswersEnums({
          additionalInformation: (questionnaire
            .additionalInformation as AdditionalInformation),
          answerUser: (answerUser as string),
          index
        })
      ) {
        return await reply.code(400).send({ message: 'Answer does not have the right responses' })
      }
      answers[question] = answerUser
      index++
    }
    await server.algorithms[name](answers, questionnaire.id, userId)
    const { id: answerId, answers: answersDB } = await createAnswer(questionnaire.id, userId, answers)
    questionnairesToDo.splice(questionnairesToDo.indexOf(questionnaire.id), 1)
    await updateUser(userId, { questionnairesToDo })
    return await reply.code(201).send({
      id: answerId,
      questionnaireId: questionnaire.id,
      name,
      answers: answersDB
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

async function getLastAlgorithmHandler (
  request: FastifyRequestTypebox<typeof GetLastAlgorithmSchema>,
  reply: FastifyReplyTypebox<typeof GetLastAlgorithmSchema>
): Promise<QuestionnaireAlgorithm> {
  try {
    const { userId } = request.user as { userId: string }
    const { id } = request.params
    const algorithmData = await findQuestionnaireAlgorithmsOrderByCreatedAt(userId, id)
    if (algorithmData.length === 0) {
      return await reply.code(404).send({ message: 'Not found' })
    }
    return await reply.send(algorithmData.at(0))
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

async function getAlgorithmHandler (
  request: FastifyRequestTypebox<typeof GetAlgorithmSchema>,
  reply: FastifyReplyTypebox<typeof GetAlgorithmSchema>
): Promise<QuestionnaireAlgorithm> {
  try {
    const { userId } = request.user as { userId: string }
    const { id } = request.params
    const algorithmData = await findQuestionnaireAlgorithmsOrderByCreatedAt(userId, id)
    return await reply.send(algorithmData)
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

async function getDefaultAlgorithmInformationHandler (
  request: FastifyRequestTypebox<typeof GetDefaultAlgorithmInformationSchema>,
  reply: FastifyReplyTypebox<typeof GetDefaultAlgorithmInformationSchema>
): Promise<DefaultAlgorithmInformation> {
  try {
    const { id } = request.params
    const { userId } = request.user as { userId: string }
    const server = request.server
    const questionnaire = await findQuestionnaireUnique('id', id)
    if (questionnaire === null) {
      return await reply.code(404).send({ message: 'Not found' })
    }
    const defaultInformation = await server.algorithmDefaults[questionnaire.name](
      questionnaire.id,
      userId
    )
    return await reply.send(defaultInformation)
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
  createQuestionnaireHandler,
  createAnswerHandler,
  getQuestionnaireHandler,
  getUserQuestionnairesInformationHandler,
  getLastAlgorithmHandler,
  getAlgorithmHandler,
  getDefaultAlgorithmInformationHandler
}
