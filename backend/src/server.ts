import Fastify, { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import userRoutes from './modules/user/user.routes'
import authPlugin from './plugins/auth/auth.plugin'

declare module 'fastify' {
  interface FastifyInstance {
    verifyEmailAndPassword: any
    authenticate: any
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string }
    user: { id: string }
  }
}

const buildServer = (): FastifyInstance => {
  const server = Fastify().withTypeProvider<TypeBoxTypeProvider>()

  void server.register(fastifyCors)

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
