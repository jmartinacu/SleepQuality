import { FastifyInstance } from 'fastify'
import { createUserHandler, logInUserHandler } from './user.controller'
import { createUserResponseSchema, createUserSchema, logInUserResponseSchema, logInUserSchema } from './user.schemas'

async function userRoutes (server: FastifyInstance): Promise<void> {
  server.post('/',
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
}

export default userRoutes
