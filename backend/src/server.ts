import Fastify, {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
  type RawRequestDefaultExpression,
  type RawServerDefault,
  type RawReplyDefaultExpression,
  type ContextConfigDefault
} from 'fastify'
import type { JWT } from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import multer from 'fastify-multer'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import userRoutes from './modules/user/user.routes'
import questionnaireRoutes from './modules/questionnaire/questionnaire.routes'
import authPlugin from './plugins/auth/auth.plugin'
import { fileFilter, destination, filename } from './plugins/auth/auth.controller'
import type { File } from './plugins/types.plugins'
import { MAX_FILE_SIZE } from './modules/user/user.schemas'
import type { RouteGenericInterface } from 'fastify/types/route'
import type { FastifySchema } from 'fastify/types/schema'

declare module 'fastify' {
  interface FastifyInstance {
    checkEmailAndPassword: any
    checkEmailAndPasswordAdmin: any
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

export type FastifyRequestTypebox<TSchema extends FastifySchema> = FastifyRequest< RouteGenericInterface,
RawServerDefault,
RawRequestDefaultExpression<RawServerDefault>,
TSchema,
TypeBoxTypeProvider
>

export type FastifyReplyTypebox<TSchema extends FastifySchema> = FastifyReply<
RawServerDefault,
RawRequestDefaultExpression,
RawReplyDefaultExpression,
RouteGenericInterface,
ContextConfigDefault,
TSchema,
TypeBoxTypeProvider
>

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
  const server = Fastify()

  void server.register(fastifyCors)

  void server.register(upload.contentParser)

  void server.register(authPlugin)

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
