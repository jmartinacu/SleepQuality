import { FastifyInstance } from 'fastify'
import { CreateAdminSchema } from './admin.schemas'
import { createAdminHandler } from './admin.controllers'

async function adminRoutes (server: FastifyInstance): Promise<void> {
  server.post('/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([
        server.checkUserVerification,
        server.checkAdmin
      ]),
      schema: CreateAdminSchema
    },
    createAdminHandler
  )
}

export default adminRoutes
