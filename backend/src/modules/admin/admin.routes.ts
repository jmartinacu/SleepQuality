import { FastifyInstance } from 'fastify'
import { CreateAdminDoctorSchema } from './admin.schemas'
import { createAdminHandler, createDoctorHandler } from './admin.controllers'

async function adminRoutes (server: FastifyInstance): Promise<void> {
  server.addHook('preHandler', server.auth([server.checkAdmin]))

  server.post('/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([
        server.checkUserVerification
      ]),
      schema: CreateAdminDoctorSchema
    },
    createAdminHandler
  )

  server.post('/doctor/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([
        server.checkUserVerification
      ]),
      schema: CreateAdminDoctorSchema
    },
    createDoctorHandler
  )
}

export default adminRoutes
