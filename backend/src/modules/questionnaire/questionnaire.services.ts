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

async function findLastAnswer (
  questionnaireId: string,
  userId: string
): Promise<Answer | null> {
  let answer: Answer | null
  const answers = await prisma.answer.findMany({
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
  if (typeof answers.at(0) === 'undefined') answer = null
  else answer = answers.at(0) as Answer
  return answer
}

async function findAnswers (
  questionnaireId: string,
  userId: string
): Promise<Answer[]> {
  const answers = await prisma.answer.findMany({
    where: {
      AND: {
        questionnaireId,
        userId
      }
    }
  })
  return answers
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

async function findLastQuestionnaireAlgorithms (
  userId: string,
  questionnaireId: string
): Promise<QuestionnaireAlgorithm | null> {
  let result: QuestionnaireAlgorithm | null
  const algorithms = await prisma.questionnaireAlgorithm.findMany({
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
  if (typeof algorithms.at(0) === 'undefined') result = null
  else result = algorithms.at(0) as QuestionnaireAlgorithm
  return result
}

export {
  createQuestionnaire,
  createAnswer,
  createAlgorithmData,
  findQuestionnaireUnique,
  findQuestionnaireMany,
  findLastAnswer,
  findAnswers,
  findQuestionnaireAlgorithmsOrderByCreatedAt,
  findLastQuestionnaireAlgorithms
}
