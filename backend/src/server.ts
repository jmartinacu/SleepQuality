import fastify from 'fastify'

const server = fastify()

server.get('/', async (_request, _reply) => {
  return { message: 'Sleep Quality API' }
})

server.get('/healthcheck', async (_request, _reply) => {
  return { status: 'ok' }
})

server.listen({ port: 8080 }, (err, address) => {
  if (err != null) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
