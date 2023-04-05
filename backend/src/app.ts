import buildServer from './server'
import prisma from './utils/database'

const server = buildServer()

async function main (): Promise<void> {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const path = await import('node:path')
      const dotenv = await import('dotenv')
      dotenv.config({ path: path.resolve(__dirname, '..', '.env') })
    }

    const PORT = Number(process.env.PORT)

    await prisma.$connect

    const urlIp6 = await server.listen({ port: PORT })

    console.log(`Server listening at ${urlIp6}`)
  } catch (error) {
    console.error(error)
    await prisma.$disconnect
    process.exit(1)
  }
}

void main()
