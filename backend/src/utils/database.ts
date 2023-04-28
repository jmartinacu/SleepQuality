import {
  PrismaClient,
  type User,
  type Session,
  type Answer,
  type Questionnaire
} from '@prisma/client'

const prisma = new PrismaClient()

export default prisma

export type {
  User,
  Session,
  Answer,
  Questionnaire
}
