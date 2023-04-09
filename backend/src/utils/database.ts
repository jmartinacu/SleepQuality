import { PrismaClient, User, Session } from '@prisma/client'
import config from 'config'

const databaseUrl = config.get<string>('databaseUrl')

const prisma = new PrismaClient({
  datasources: {
    db: { url: databaseUrl }
  }
})

export default prisma

export {
  User,
  Session
}
