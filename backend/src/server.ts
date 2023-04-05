import fastify, { FastifyInstance } from 'fastify'
import fastifyBycript from 'fastify-bcrypt'
import fastifyAuth from '@fastify/auth'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import userRoutes from './modules/user/user.routes'
import authPlugin from './plugins/auth/auth.plugin'

declare module 'fastify' {
  interface FastifyInstance {
    verifyEmailAndPassword: any
  }
}

const buildServer = (): FastifyInstance => {
  const server = fastify().withTypeProvider<TypeBoxTypeProvider>()

  void server.register(fastifyBycript, {
    saltWorkFactor: 12
  })

  void server.register(fastifyAuth, {
    defaultRelation: 'and'
  })

  void server.register(authPlugin)

  server.after(() => {
    server.get('/', async (_request, _reply) => {
      return { message: 'Sleep Quality API' }
    })

    server.get('/healthcheck', async (_request, _reply) => {
      return { status: 'ok' }
    })

    void server.register(userRoutes, { prefix: 'api/users' })
  })

  return server
}

export default buildServer
