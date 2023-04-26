import { PrismaClient, type User, type Session } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma

export type {
  User,
  Session
}
