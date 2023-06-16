import { FastifyInstance } from 'fastify'
import { LogInSchema, RefreshTokenSchema } from '../user/user.schemas'
import {
  getUserInformationHandler,
  addDoctorToUserHandler,
  addQuestionnaireToUserHandler,
  logInDoctorHandler,
  refreshAccessTokenHandler,
  getDoctorAuthenticatedHandler,
  getQuestionnairesHandler,
  getQuestionnaireHandler,
  getUsersHandler,
  getUserHandler,
  deleteDoctorHandler,
  getUsersImagesHandler
} from './doctor.controllers'
import {
  AddDoctorToUserSchema,
  AddQuestionnairesToUserSchema,
  DeleteDoctorAuthenticatedSchema,
  GetDoctorAuthenticatedSchema,
  GetUserInformationSchema,
  GetUserSchema,
  GetUsersImagesSchema,
  GetUsersSchema
} from './doctor.schemas'
import {
  GetQuestionnaireSchema,
  GetQuestionnairesInformationSchema
} from '../questionnaire/questionnaire.schemas'

async function doctorRoutes (server: FastifyInstance): Promise<void> {
  server.get('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: GetDoctorAuthenticatedSchema
    },
    getDoctorAuthenticatedHandler
  )

  server.delete('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: DeleteDoctorAuthenticatedSchema
    },
    deleteDoctorHandler
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

  // TODO: AÑADIR RUTA PARA MANDAR FOTOS PERFILES DE SUS USUARIOS
  server.get('/users',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: GetUsersSchema
    },
    getUsersHandler
  )

  server.get('/users/images',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: GetUsersImagesSchema
    },
    getUsersImagesHandler
  )

  server.get('/users/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: GetUserSchema
    },
    getUserHandler
  )

  server.post('/users/questionnaires/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: AddQuestionnairesToUserSchema
    },
    addQuestionnaireToUserHandler
  )

  server.post('/users/:email',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: AddDoctorToUserSchema
    },
    addDoctorToUserHandler
  )

  server.get('/users/:userId/:questionnaireId',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: GetUserInformationSchema
    },
    getUserInformationHandler
  )

  server.get('/questionnaires',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: GetQuestionnairesInformationSchema
    },
    getQuestionnairesHandler
  )

  server.get('/questionnaires/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkDoctorVerification]),
      schema: GetQuestionnaireSchema
    },
    getQuestionnaireHandler
  )
}

export default doctorRoutes
