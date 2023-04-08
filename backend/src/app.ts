import buildServer from './server'
import config from 'config'
import dotenv from 'dotenv'
import prisma from './utils/database'

const server = buildServer()

export default server

async function main (): Promise<void> {
  try {
    dotenv.config()
    await prisma.$connect

    const port = config.get<number>('port')

    const urlIp6 = await server.listen({ port })

    console.log(`Server listening at ${urlIp6}`)
  } catch (error) {
    console.error(error)
    await prisma.$disconnect
    process.exit(1)
  }
}

void main()
