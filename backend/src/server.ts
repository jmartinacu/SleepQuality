import Fastify, { FastifyInstance } from 'fastify'
import { JWT } from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyView from '@fastify/view'
import handlebars from 'handlebars'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import path from 'node:path'
import userRoutes from './modules/user/user.routes'
import authPlugin from './plugins/auth/auth.plugin'

declare module 'fastify' {
  interface FastifyInstance {
    checkEmailAndPassword: any
    checkUserVerification: any
    checkAdmin: any
    checkSession: any
    authenticate: any
    jwt: JWT
  }
  interface FastifyRequest {
    accessVerify: any
    refreshVerify: any
  }
  interface FastifyReply {
    accessSign: any
    refreshSign: any
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string }
    user: { userId?: string }
  }
  interface JWT {
    access: any
    refresh: any
  }
}

const buildServer = (): FastifyInstance => {
  const server = Fastify().withTypeProvider<TypeBoxTypeProvider>()

  void server.register(fastifyCors)

  void server.register(fastifyView, {
    engine: {
      handlebars
    },
    root: path.resolve(__dirname, '..', 'templates')

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
