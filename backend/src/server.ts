import fastify from 'fastify'

const start = async (): Promise<null> => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const path = await import('node:path')
      const dotenv = await import('dotenv')
      dotenv.config({ path: path.resolve(__dirname, '..', '.env') })
      console.log(process.env.PORT)
    }

    const PORT = Number(process.env.PORT)

    const server = fastify()

    server.get('/', async (_request, _reply) => {
      return { message: 'Sleep Quality API' }
    })

    server.get('/healthcheck', async (_request, _reply) => {
      return { status: 'ok' }
    })

    await server.listen({ port: PORT })

    const { port, address } = server.addresses()[0]

    console.log(`Server listening at http://${address}:${port}`)

    return null
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

void start()
