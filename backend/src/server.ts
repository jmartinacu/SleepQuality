import fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import userRoutes from './modules/user/user.routes'

const server = async (): Promise<void> => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const path = await import('node:path')
      const dotenv = await import('dotenv')
      dotenv.config({ path: path.resolve(__dirname, '..', '.env') })
    }

    const PORT = Number(process.env.PORT)

    const server = fastify().withTypeProvider<TypeBoxTypeProvider>()

    server.get('/', async (_request, _reply) => {
      return { message: 'Sleep Quality API' }
    })

    server.get('/healthcheck', async (_request, _reply) => {
      return { status: 'ok' }
    })

    void server.register(userRoutes, { prefix: 'api/users' })

    await server.listen({ port: PORT })

    const { port, address } = server.addresses()[0]

    console.log(`Server listening at http://${address}:${port}`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

void server()
