import prisma, {
  type QuestionnaireAlgorithm,
  type Answer,
  type Questionnaire
} from '../../utils/database'
import type {
  AnswerUser,
  CreateAlgorithmInput,
  CreateQuestionnaireInput
} from './questionnaire.schemas'

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

async function createAlgorithmData (
  algorithmData: CreateAlgorithmInput,
  userId: string,
  questionnaireId: string
): Promise<QuestionnaireAlgorithm> {
  const algorithm = await prisma.questionnaireAlgorithm.create({
    data: {
      userId,
      questionnaireId,
      ...algorithmData
    }
  })
  return algorithm
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

async function findQuestionnaireMany (
  uniqueIdentifier: 'id' | 'name' | 'all',
  values: string[]
): Promise<Questionnaire[]> {
  let questionnaires: Questionnaire[]
  if (uniqueIdentifier === 'all') {
    questionnaires = await prisma.questionnaire.findMany()
  } else if (uniqueIdentifier === 'id') {
    questionnaires = await prisma.questionnaire.findMany({
      where: {
        id: {
          in: values
        }
      }
    })
  } else {
    questionnaires = await prisma.questionnaire.findMany({
      where: {
        name: {
          in: values
        }
      }
    })
  }
  return questionnaires
}

async function findQuestionnaireAlgorithmsOrderByCreatedAt (
  userId: string,
  questionnaireId: string
): Promise<QuestionnaireAlgorithm[]> {
  const result = await prisma.questionnaireAlgorithm.findMany({
    where: {
      AND: {
        questionnaireId,
        userId
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return result
}

export {
  createQuestionnaire,
  createAnswer,
  createAlgorithmData,
  findQuestionnaireUnique,
  findQuestionnaireMany,
  findQuestionnaireAlgorithmsOrderByCreatedAt
}
