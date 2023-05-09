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
  createDoctorHandler
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
  CreateDoctorSchema
} from './user.schemas'
import { upload } from '../../server'

async function userRoutes (server: FastifyInstance): Promise<void> {
  server.post('/',
    {
      schema: CreateUserSchema
    },
    createUserHandler
  )

  server.post('/doctor',
    {
      schema: CreateDoctorSchema
    },
    createDoctorHandler
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

  server.post('/resetpassword/:id/:passwordResetCode',
    {
      schema: ResetPasswordSchema
    },
    resetPasswordHandler
  )

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

  server.get('/images',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetProfilePictureSchema
    },
    getProfilePictureHandler
  )
}

export default userRoutes
