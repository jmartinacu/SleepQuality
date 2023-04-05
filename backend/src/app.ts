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

    await server.listen({ port: PORT })

    const { port, address } = server.addresses()[0]

    console.log(`Server listening at http://${address}:${port}`)
  } catch (error) {
    console.error(error)
    await prisma.$disconnect
    process.exit(1)
  }
}

void main()
