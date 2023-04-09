import { FastifyInstance } from 'fastify'
import {
  createUserHandler,
  logInUserHandler,
  getUserHandler,
  verifyAccountHandler
} from './user.controllers'
import {
  CreateUserInput,
  FindUserParamsSchema,
  VerifyAccountParamsSchema,
  createUserResponseSchema,
  createUserSchema,
  findUserParamsSchema,
  logInUserResponseSchema,
  logInUserSchema,
  verifyAccountParamsSchema,
  verifyAccountResponseSchema
} from './user.schemas'

async function userRoutes (server: FastifyInstance): Promise<void> {
  server.post<{
    Body: CreateUserInput
  }>('/',
    {
      schema: {
        body: createUserSchema,
        response: {
          201: createUserResponseSchema
        }
      }
    },
    createUserHandler
  )
  server.post('/login',
    {
      preHandler: server.auth([server.checkEmailAndPassword]),
      schema: {
        body: logInUserSchema,
        response: {
          200: logInUserResponseSchema
        }
      }
    },
    logInUserHandler
  )

  server.get<{
    Params: FindUserParamsSchema
  }>('/:id',
    {
      preHandler: server.auth([
        server.authenticate,
        server.checkUserVerification
      ]),
      schema: {
        params: findUserParamsSchema,
        response: {
          200: createUserResponseSchema
        }
      }
    },
    getUserHandler
  )

  server.get<{
    Params: VerifyAccountParamsSchema
  }>('/:id/:verificationCode',
    {
      schema: {
        params: verifyAccountParamsSchema,
        response: {
          200: verifyAccountResponseSchema,
          400: verifyAccountResponseSchema
        }
      }
    },
    verifyAccountHandler
  )
}

export default userRoutes
