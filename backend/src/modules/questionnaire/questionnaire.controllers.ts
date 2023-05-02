import {
  QuestionTypes,
  CreateQuestionnaireSchema,
  CreateAnswerSchema,
  AdditionalInformationTypes
} from './questionnaire.schemas'
import { Answer, Questionnaire } from '../../utils/database'
import {
  createAnswer,
  createQuestionnaire,
  findQuestionnaireUnique
} from './questionnaire.services'
import type { FastifyRequestTypebox, FastifyReplyTypebox } from '../../server'
import { checkAnswerTypes, checkAnswersEnums } from '../../utils/helpers'

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
    // CHECK TYPES OF EACH ANSWER AND CHECK ENUM ANSWER
    const questionsToCheckEnums = (questionnaire.additionalInformation as AdditionalInformationTypes[])
      .reduce((result, current) => {
        if (Object.prototype.hasOwnProperty.call(current, 'enum')) {
          (current.questions as number[]).forEach(question => result.add(question))
        }
        return result
      }, new Set<number>())
    let index = 1
    for (const [question, questionType] of
      Object.entries(questionnaire.questions as QuestionTypes)
    ) {
      const answerUser: any = answers[question]
      if (!checkAnswerTypes[questionType](answerUser)) {
        return await reply.code(400).send({ message: 'Incorrect answer' })
      }
      if (questionsToCheckEnums.has(index)) {
        if (!checkAnswersEnums({
          additionalInformation: (questionnaire
            .additionalInformation as AdditionalInformationTypes[]),
          answerUser,
          index
        })) {
          return await reply.code(400).send({ message: 'Incorrect answer' })
        }
      }
      index++
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
