import { FastifyInstance } from 'fastify'
import { LogInSchema, RefreshTokenSchema } from '../user/user.schemas'
import {
  addDoctorToUserHandler,
  addQuestionnaireToUserHandler,
  logInDoctorHandler,
  refreshAccessTokenHandler
} from './doctor.controllers'
import { AddDoctorToUserSchema, AddQuestionnairesToUserSchema } from './doctor.schemas'

async function doctorRoutes (server: FastifyInstance): Promise<void> {
  server.post('/login',
    {
      preHandler: server.auth([
        server.checkDoctorVerificationWithoutAuthorization,
        server.checkEmailAndPassword
      ]),
      schema: LogInSchema
    },
    logInDoctorHandler
  )

  server.post('/refresh',
    {
      schema: RefreshTokenSchema
    },
    refreshAccessTokenHandler
  )

  server.post('/questionnaires/users/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: AddQuestionnairesToUserSchema
    },
    addQuestionnaireToUserHandler
  )

  // TODO: EL DOCTOR DEBERIA MANDAR UN EMAIL AL USUARIO, CLICANDO UN ENLACE
  // EN EL EMAIL, SE AGREGARA ESTE DOCTOR AL USUARIO
  server.post('/users/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: AddDoctorToUserSchema
    },
    addDoctorToUserHandler
  )
  // TODO: SEND INFORMATION OF THE USER TO THE DOCTOR
}

export default doctorRoutes
