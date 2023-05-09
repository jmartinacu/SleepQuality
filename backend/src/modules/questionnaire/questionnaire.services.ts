import prisma, { type Answer, type Questionnaire } from '../../utils/database'
import type { AnswerUser, CreateQuestionnaireInput } from './questionnaire.schemas'

async function createQuestionnaire (data: CreateQuestionnaireInput): Promise<Questionnaire> {
  const questionnaire = await prisma.questionnaire.create({
    data
  })
  return questionnaire
}

async function createAnswer (
  questionnaireId: string,
  userId: string,
  answers: AnswerUser
): Promise<Answer> {
  const answer = await prisma.answer.create({
    data: {
      answers,
      questionnaireId,
      userId
    }
  })
  return answer
}

async function findQuestionnaireUnique (
  uniqueIdentifier: 'id' | 'name',
  value: string
): Promise<Questionnaire | null> {
  let questionnaire: Questionnaire | null
  if (uniqueIdentifier === 'name') {
    questionnaire = await prisma.questionnaire.findUnique({
      where: {
        name: value
      }
    })
  } else {
    questionnaire = await prisma.questionnaire.findUnique({
      where: {
        id: value
      }
    })
  }
  return questionnaire
}

export {
  createQuestionnaire,
  createAnswer,
  findQuestionnaireUnique
}
