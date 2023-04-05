import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma

export {
  User
}
