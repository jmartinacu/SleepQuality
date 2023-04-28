import {
  QuestionsType,
  checkAnswerUsers,
  CreateQuestionnaireSchema,
  CreateAnswerSchema
} from './questionnaire.schemas'
import { Answer, Questionnaire } from '../../utils/database'
import {
  createAnswer,
  createQuestionnaire,
  findQuestionnaireUnique
} from './questionnaire.services'
import type { FastifyRequestTypebox, FastifyReplyTypebox } from '../../server'

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

async function createAnswerHandler (
  request: FastifyRequestTypebox<typeof CreateAnswerSchema>,
  reply: FastifyReplyTypebox<typeof CreateAnswerSchema>
): Promise<Answer> {
  try {
    const { userId } = request.user as { userId: string }
    const { answers, name } = request.body
    const questionnaire = await findQuestionnaireUnique('name', name)
    if (questionnaire === null) {
      return await reply.code(400).send({
        message: `Questionnaire with name equal to ${name} does not exist`
      })
    }
    // CHECK THAT THE ANSWERS IS AN OBJECT
    if (typeof answers !== 'object' || Array.isArray(answers) || answers === null) {
      return await reply.code(400).send({ message: 'Incorrect answer' })
    }
    // CHECK THAT THE QUESTIONS IN QUESTIONNAIRE AND THE QUESTIONS IN ANSWER ARE THE SAME
    if (JSON.stringify(Object.keys(questionnaire.questions as Object)) === JSON.stringify(Object.keys(answers))) {
      return await reply.code(400).send({ message: 'Incorrect answer' })
    }
    // CHECK TYPES OF EACH ANSWER
    for (const [key, value] of Object.entries(questionnaire.questions as QuestionsType)) {
      const answerUser: any = answers[key]
      if (!checkAnswerUsers[value](answerUser)) {
        return await reply.code(400).send({ message: 'Incorrect answer' })
      }
    }
    const answer = await createAnswer(questionnaire.id, userId, answers)
    return answer
  } catch (error) {
    console.error(error)
    return await reply.code(500).send(error)
  }
}

export {
  createQuestionnaireHandler,
  createAnswerHandler
}
