import Fastify, { type FastifyInstance } from 'fastify'
import type { JWT } from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import multer from 'fastify-multer'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import userRoutes from './modules/user/user.routes'
import questionnaireRoutes from './modules/questionnaire/questionnaire.routes'
import authPlugin from './plugins/auth/auth.plugin'
import { fileFilter, destination, filename } from './plugins/auth/auth.controller'
import type { File } from './plugins/types.plugins'
import { MAX_FILE_SIZE } from './modules/user/user.schemas'

declare module 'fastify' {
  interface FastifyInstance {
    checkEmailAndPassword: any
    checkUserVerification: any
    checkUserVerificationWithoutAuthorization: any
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
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
})

const buildServer = (): FastifyInstance => {
  const server = Fastify().withTypeProvider<TypeBoxTypeProvider>()

  void server.register(fastifyCors)

  void server.register(upload.contentParser)

  void server.register(authPlugin)

  // server.setErrorHandler((error, _request, reply) => {
  //   if (error instanceof ZodError) {
  //     console.error(error)
  //     void reply.status(400).send({
  //       statusCode: 400,
  //       error: 'Bad Request',
  //       issues: error.issues.reduce<{ [key: string | number]: string }>((acc, item) => {
  //         acc[item.path[0]] = item.message
  //         return acc
  //       }, {})
  //     })
  //   }
  // })

  server.after(() => {
    server.get('/', async (_request, _reply) => {
      return { message: 'Sleep Quality API' }
    })

    server.get('/healthcheck', async (_request, _reply) => {
      return { status: 'ok' }
    })

    void server.register(userRoutes, { prefix: 'api/users' })
    void server.register(questionnaireRoutes, { prefix: 'api/questionnaires' })
  })

  return server
}

export default buildServer
