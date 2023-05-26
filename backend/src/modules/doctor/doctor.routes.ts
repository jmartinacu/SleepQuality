import { FastifyInstance } from 'fastify'
import { LogInSchema, RefreshTokenSchema } from '../user/user.schemas'
import {
  getUserInformationHandler,
  addDoctorToUserHandler,
  addQuestionnaireToUserHandler,
  logInDoctorHandler,
  refreshAccessTokenHandler,
  getDoctorAuthenticatedHandler
} from './doctor.controllers'
import {
  AddDoctorToUserSchema,
  AddQuestionnairesToUserSchema,
  GetDoctorAuthenticatedSchema,
  GetUserInformationSchema
} from './doctor.schemas'

async function doctorRoutes (server: FastifyInstance): Promise<void> {
  server.get('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: GetDoctorAuthenticatedSchema
    },
    getDoctorAuthenticatedHandler
  )

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

  // TODO: HANDLE FASTIFY TokenError: The token signature is invalid.
  server.post('/refresh',
    {
      schema: RefreshTokenSchema
    },
    refreshAccessTokenHandler
  )

  server.post('/users/questionnaires/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: AddQuestionnairesToUserSchema
    },
    addQuestionnaireToUserHandler
  )

  server.post('/users/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: AddDoctorToUserSchema
    },
    addDoctorToUserHandler
  )
  // TODO: SEND INFORMATION OF THE USER TO THE DOCTOR
  server.get('/users/:userId/:questionnaireId',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: GetUserInformationSchema
    },
    getUserInformationHandler
  )
}

export default doctorRoutes
