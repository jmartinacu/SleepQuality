import { FastifyRequest, FastifyReply } from 'fastify'
import {
  CreateQuestionnaireSchema,
  CreateAnswerSchema,
  type Questions,
  type AdditionalInformation,
  GetQuestionnaireSchema,
  GetLastAlgorithmSchema,
  GetAlgorithmSchema,
  GetDefaultAlgorithmInformationSchema,
  DefaultAlgorithmInformation
} from './questionnaire.schemas'
import { Answer, Questionnaire, QuestionnaireAlgorithm } from '../../utils/database'
import {
  createAnswer,
  createQuestionnaire,
  findQuestionnaireAlgorithmsOrderByCreatedAt,
  findQuestionnaireUnique,
  findQuestionnaires
} from './questionnaire.services'
import type { FastifyRequestTypebox, FastifyReplyTypebox } from '../../server'
import {
  checkAnswerTypes,
  checkAnswersEnums,
  convertToCorrectType
} from '../../utils/helpers'

async function createQuestionnaireHandler (
  request: FastifyRequestTypebox<typeof CreateQuestionnaireSchema>,
  reply: FastifyReplyTypebox<typeof CreateQuestionnaireSchema>
): Promise<Questionnaire> {
  try {
    const data = request.body
    const questionnaire = await createQuestionnaire(data)
    return await reply.code(201).send(questionnaire)
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
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
    console.error(error)
    return await reply.code(500).send(error)
  }
}

async function getQuestionnairesInformationHandler (
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<Questionnaire[]> {
  try {
    const questionnaires = await findQuestionnaires()
    return await reply.send(questionnaires)
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
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
    if (questionnaire === null) {
      return await reply.code(400).send({
        message: `Questionnaire ${name} does not exist`
      })
    }
    // CHECK THAT THE QUESTIONS IN QUESTIONNAIRE AND THE QUESTIONS IN ANSWER ARE THE SAME
    if (JSON.stringify(Object.keys(questionnaire.questions as object)) !== JSON.stringify(Object.keys(answers))) {
      return await reply.code(400).send({ message: 'Answer does not have the right questions' })
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
    const {
      id,
      answers: answersDB
    } = await createAnswer(questionnaire.id, userId, answers)
    return await reply.code(201).send({
      id,
      questionnaireId: questionnaire.id,
      name,
      answers: answersDB
    })
  } catch (error) {
    console.error(error)
    if (error instanceof Error && error.message === 'Wrong date format') {
      return await reply.code(400).send({ message: 'Answer does not have the right responses' })
    }
    return await reply.code(500).send(error)
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
    console.error(error)
    return await reply.code(500).send(error)
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
    console.error(error)
    return await reply.code(500).send(error)
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
    console.error(error)
    return await reply.code(500).send(error)
  }
}

export {
  createQuestionnaireHandler,
  createAnswerHandler,
  getQuestionnaireHandler,
  getQuestionnairesInformationHandler,
  getLastAlgorithmHandler,
  getAlgorithmHandler,
  getDefaultAlgorithmInformationHandler
}
