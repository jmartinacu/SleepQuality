import fastify, { FastifyInstance } from 'fastify'
import fastifyBycript from 'fastify-bcrypt'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import userRoutes from './modules/user/user.routes'

const buildServer = (): FastifyInstance => {
  const server = fastify().withTypeProvider<TypeBoxTypeProvider>()

  void server.register(fastifyBycript, {
    saltWorkFactor: 12
  })

  server.get('/', async (_request, _reply) => {
    return { message: 'Sleep Quality API' }
  })

  server.get('/healthcheck', async (_request, _reply) => {
    return { status: 'ok' }
  })

  void server.register(userRoutes, { prefix: 'api/users' })

  return server
}

export default buildServer
