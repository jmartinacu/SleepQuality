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
  updateUserHandler
} from './user.controllers'
import {
  createUserResponseSchema,
  createUserSchema,
  logInUserResponseSchema,
  logInUserSchema,
  verifyAccountParamsSchema,
  verifyAccountResponseSchema,
  errorResponseSchema,
  refreshTokenHeaderSchema,
  refreshTokenResponseSchema,
  emailUserSchema,
  resetPasswordParamsSchema,
  resetPasswordBodySchema,
  getProfilePictureResponseSchema,
  EmailUserInput,
  updateUserSchema,
  UpdateUserInput
} from './user.schemas'
import { upload } from '../../server'

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

  server.post('/refresh',
    {
      schema: {
        headers: refreshTokenHeaderSchema,
        response: {
          200: refreshTokenResponseSchema,
          401: errorResponseSchema,
          400: errorResponseSchema
        }
      }
    },
    refreshAccessTokenHandler
  )

  server.post('/login',
    {
      preHandler: server.auth([
        server.checkUserVerificationWithoutAuthorization,
        server.checkEmailAndPassword
      ]),
      schema: {
        body: logInUserSchema,
        response: {
          200: logInUserResponseSchema,
          401: errorResponseSchema
        }
      }
    },
    logInUserHandler
  )

  server.get('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: {
        response: {
          200: createUserResponseSchema
        }
      }
    },
    getMeHandler
  )

  server.delete('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: {
        response: {
          204: {}
        }
      }
    },
    deleteUserHandler
  )

  server.patch<{
    Body: UpdateUserInput
  }>('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: {
        body: updateUserSchema,
        response: {
          200: verifyAccountResponseSchema
        }
      }
    },
    updateUserHandler
  )

  server.get('/verify/:id/:verificationCode',
    {
      schema: {
        params: verifyAccountParamsSchema,
        response: {
          200: verifyAccountResponseSchema,
          400: errorResponseSchema,
          404: errorResponseSchema
        }
      }
    },
    verifyAccountHandler
  )

  server.post<{
    Body: EmailUserInput
  }>('/forgotpassword',
    {
      preHandler: server.auth([server.checkUserVerificationWithoutAuthorization]),
      schema: {
        body: emailUserSchema,
        response: {
          200: verifyAccountResponseSchema,
          401: errorResponseSchema
        }
      }
    },
    forgotPasswordHandler
  )

  server.post('/resetpassword/:id/:passwordResetCode',
    {
      schema: {
        params: resetPasswordParamsSchema,
        body: resetPasswordBodySchema,
        response: {
          200: verifyAccountResponseSchema,
          404: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema
        }
      }
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
      schema: {
        response: {
          200: verifyAccountResponseSchema,
          400: errorResponseSchema
        }
      }
    },
    addProfilePictureHandler
  )

  server.get('/images',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: {
        response: {
          200: getProfilePictureResponseSchema,
          404: errorResponseSchema
        }
      }
    },
    getProfilePictureHandler
  )
}

export default userRoutes
