import buildServer from './server'
import config from 'config'
import prisma from './utils/database'

const server = buildServer()

export default server

async function main (): Promise<void> {
  try {
    await prisma.$connect()

    const port = config.get<number>('port')

    const hostname = await server.listen({ port })

    console.log(`Server listening at ${hostname}`)
  } catch (error) {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

void main()
