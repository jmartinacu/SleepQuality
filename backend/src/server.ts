import fastify, { FastifyInstance } from 'fastify'
import fastifyBycript from 'fastify-bcrypt'
import fastifyAuth from '@fastify/auth'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import userRoutes from './modules/user/user.routes'
import { verifyEmailAndPasswordHandler } from './utils/decorators.controller'

declare module 'fastify' {
  interface FastifyInstance {
    verifyEmailAndPassword: any
  }
}

const buildServer = (): FastifyInstance => {
  const server = fastify().withTypeProvider<TypeBoxTypeProvider>()

  server.decorate('verifyEmailAndPassword', verifyEmailAndPasswordHandler)

  void server.register(fastifyBycript, {
    saltWorkFactor: 12
  })

  void server.register(fastifyAuth, {
    defaultRelation: 'and'
  })

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
