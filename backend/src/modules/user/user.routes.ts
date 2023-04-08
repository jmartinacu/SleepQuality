import { FastifyInstance } from 'fastify'
import { createUserHandler, logInUserHandler, getUserHandler } from './user.controllers'
import {
  CreateUserInput,
  FindUserParamsSchema,
  createUserResponseSchema,
  createUserSchema,
  findUserParamsSchema,
  logInUserResponseSchema,
  logInUserSchema
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
      preHandler: server.auth([server.verifyEmailAndPassword]),
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
      preHandler: server.auth([server.authenticate]),
      schema: {
        params: findUserParamsSchema,
        response: {
          200: createUserResponseSchema
        }
      }
    },
    getUserHandler
  )
}

export default userRoutes
