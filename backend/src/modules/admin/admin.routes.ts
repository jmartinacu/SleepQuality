import { FastifyInstance } from 'fastify'
import { CreateAdminSchema } from './admin.schemas'
import { createAdminHandler, createDoctorHandler, createManyDoctorHandler } from './admin.controllers'
import { CreateDoctorSchema, CreateManyDoctorsSchema } from '../doctor/doctor.schemas'

async function adminRoutes (server: FastifyInstance): Promise<void> {
  server.addHook('preHandler', server.auth([server.checkAdmin]))

  server.post('/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: CreateAdminSchema
    },
    createAdminHandler
  )

  server.post('/doctors/:email',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: CreateDoctorSchema
    },
    createDoctorHandler
  )

  server.post('/doctors',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUsersVerification]),
      schema: CreateManyDoctorsSchema
    },
    createManyDoctorHandler
  )
}

export default adminRoutes
