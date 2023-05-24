import { FastifyInstance } from 'fastify'
import { LogInSchema, RefreshTokenSchema } from '../user/user.schemas'
import { addQuestionnaireToUserHandler, logInDoctorHandler, refreshAccessTokenHandler } from './doctor.controllers'
import { AddQuestionnairesToUserSchema } from './doctor.schemas'

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
}

export default doctorRoutes
