import type { FastifyInstance } from 'fastify'
import {
  createUserHandler,
  logInUserHandler,
  getMeHandler,
  verifyAccountHandler,
  refreshAccessTokenHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  addProfilePictureHandler,
  getProfilePictureHandler,
  deleteUserHandler,
  updateUserHandler,
  acceptDoctorHandler,
  getCSVDataHandler,
  getQuestionnaireInformationHandler,
  getAdminHandler
} from './user.controllers'
import {
  CreateUserSchema,
  RefreshTokenSchema,
  LogInSchema,
  GetUserAuthenticatedSchema,
  DeleteUserAuthenticatedSchema,
  UpdateUserAuthenticatedSchema,
  VerifyUserSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  AddProfilePictureSchema,
  GetProfilePictureSchema,
  AcceptDoctorSchema,
  GetCSVDataSchema,
  GetQuestionnaireInformationSchema,
  GetAdminSchema
} from './user.schemas'
import { upload } from '../../server'

async function userRoutes (server: FastifyInstance): Promise<void> {
  server.post('/',
    {
      schema: CreateUserSchema
    },
    createUserHandler
  )

  server.post('/refresh',
    {
      schema: RefreshTokenSchema
    },
    refreshAccessTokenHandler
  )

  server.post('/login',
    {
      preHandler: server.auth([
        server.checkUserVerificationWithoutAuthorization,
        server.checkEmailAndPassword
      ]),
      schema: LogInSchema
    },
    logInUserHandler
  )

  server.get('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetUserAuthenticatedSchema
    },
    getMeHandler
  )

  // TODO TESTING HAPPY PATH
  server.delete('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: DeleteUserAuthenticatedSchema
    },
    deleteUserHandler
  )

  server.patch('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: UpdateUserAuthenticatedSchema
    },
    updateUserHandler
  )

  server.get('/verify/:id/:verificationCode',
    {
      schema: VerifyUserSchema
    },
    verifyAccountHandler
  )

  server.post('/forgotpassword',
    {
      preHandler: server.auth([server.checkUserVerificationWithoutAuthorization]),
      schema: ForgotPasswordSchema
    },
    forgotPasswordHandler
  )

  // TODO FIX TESTING HAPPY PATH
  server.post('/resetpassword/:passwordResetCode',
    {
      schema: ResetPasswordSchema
    },
    resetPasswordHandler
  )

  // TODO TESTING HAPPY PATH
  server.get('/doctors/:id/:doctorCode',
    {
      schema: AcceptDoctorSchema
    },
    acceptDoctorHandler
  )

  // TODO TESTING HAPPY PATH
  server.post('/images',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([
        server.checkUserVerification,
        upload.single('profilePicture')
      ]),
      schema: AddProfilePictureSchema
    },
    addProfilePictureHandler
  )

  // TODO TESTING HAPPY PATH
  server.get('/images',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetProfilePictureSchema
    },
    getProfilePictureHandler
  )

  // TODO: AÑADIR RUTA PARA PODER CONSEGUIR LA CSV DATA DE CUESTIONARIOS ESPECIFICOS
  server.get('/data/csv',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetCSVDataSchema
    },
    getCSVDataHandler
  )

  server.get('/data',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetQuestionnaireInformationSchema
    },
    getQuestionnaireInformationHandler
  )

  server.get('/admin',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([
        server.checkAdmin,
        server.checkUserVerification
      ]),
      schema: GetAdminSchema
    },
    getAdminHandler
  )
}

export default userRoutes
