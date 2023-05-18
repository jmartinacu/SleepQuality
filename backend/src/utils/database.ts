import {
  PrismaClient,
  type User,
  type Session,
  type Answer,
  type Questionnaire,
  type QuestionnaireAlgorithm
} from '@prisma/client'

const prisma = new PrismaClient()

export default prisma

export type {
  User,
  Session,
  Answer,
  Questionnaire,
  QuestionnaireAlgorithm
}
