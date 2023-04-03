import { FastifyInstance } from 'fastify'
import { createUserHandler } from './user.controller'
import { createUserResponseSchema, createUserSchema } from './user.schemas'

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
}

export default userRoutes
