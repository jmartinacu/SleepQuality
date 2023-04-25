import Fastify, { type FastifyInstance } from 'fastify'
import type { JWT } from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import multer from 'fastify-multer'
import { ZodError } from 'zod'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from 'fastify-type-provider-zod'
import userRoutes from './modules/user/user.routes'
import questionnaireRoutes from './modules/questionnaire/questionnaire.routes'
import authPlugin from './plugins/auth/auth.plugin'
import { fileFilter, destination, filename } from './plugins/auth/auth.controller'
import type { File } from './plugins/types.plugins'

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
    file?: File
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

const storage = multer.diskStorage({
  destination,
  filename
})

export const upload = multer({
  storage,
  fileFilter
})

const buildServer = (): FastifyInstance => {
  const server = Fastify()

  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)

  void server.register(fastifyCors)

  void server.register(upload.contentParser)

  void server.register(authPlugin)

  server.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      console.error(error)
      void reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        issues: error.issues.reduce<{ [key: string]: string }>((acc, item) => {
          const path = String(item.path[0])
          acc[path] = item.message
          return acc
        }, {})
      })
    }
  })

  server.after(() => {
    server.get('/', async (_request, _reply) => {
      return { message: 'Sleep Quality API' }
    })

    server.get('/healthcheck', async (_request, _reply) => {
      return { status: 'ok' }
    })

    void server.withTypeProvider<ZodTypeProvider>()
      .register(userRoutes, { prefix: 'api/users' })
    void server.withTypeProvider<ZodTypeProvider>()
      .register(questionnaireRoutes, { prefix: 'api/questionnaires' })
  })

  return server
}

export default buildServer
