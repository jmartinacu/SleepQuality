import type { FastifyInstance } from 'fastify'
import {
  createUserHandler,
  logInUserHandler,
  getMeHandler,
  verifyAccountHandler,
  refreshAccessTokenHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  addProfilePictureHandler
} from './user.controllers'
import {
  createUserResponseSchema,
  createUserSchema,
  logInUserResponseSchema,
  logInUserSchema,
  verifyAccountParamsSchema,
  verifyAccountResponseSchema,
  verificationErrorResponseSchema,
  refreshTokenHeaderSchema,
  refreshTokenResponseSchema,
  forgotPasswordSchema,
  resetPasswordParamsSchema,
  resetPasswordBodySchema
} from './user.schemas'
import { upload } from '../../server'

// CUANDO NO SE LE PASA UN OBJECT ID VALIDO A PRISMA PETA CON UN 500
// Y ENSEÑA AL USUARIO DATOS PRISMA CAMBIAR ESO EN EL FUTURO
// PARA MANDAR UN ERROR SINTÁCTICO Y DARLE AL USUARIO UN 404
// CREO QUE YA LO TENGO SOLUCIONADO CON EL REGEX PARA OBJECTID  QUEDA HACER TESTING
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
          401: verificationErrorResponseSchema,
          400: verificationErrorResponseSchema
        }
      }
    },
    refreshAccessTokenHandler
  )

  server.post('/login',
    {
      preHandler: server.auth([server.checkEmailAndPassword]),
      schema: {
        body: logInUserSchema,
        response: {
          200: logInUserResponseSchema,
          401: verificationErrorResponseSchema
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
          200: createUserResponseSchema,
          401: verificationErrorResponseSchema
        }
      }
    },
    getMeHandler
  )

  server.get('/verify/:id/:verificationCode',
    {
      schema: {
        params: verifyAccountParamsSchema,
        response: {
          200: verifyAccountResponseSchema,
          400: verificationErrorResponseSchema
        }
      }
    },
    verifyAccountHandler
  )

  server.post('/forgotpassword',
    {
      schema: {
        body: forgotPasswordSchema,
        response: {
          200: verifyAccountResponseSchema,
          401: verificationErrorResponseSchema
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
          404: verificationErrorResponseSchema,
          401: verificationErrorResponseSchema,
          403: verificationErrorResponseSchema
        }
      }
    },
    resetPasswordHandler
  )

  server.post('/profile',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([
        server.checkUserVerification,
        upload.single('profilePicture')
      ]),
      schema: {
        response: {
          200: verifyAccountResponseSchema
        }
      }
    },
    addProfilePictureHandler
  )

  server.get('/profile',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification])

    },
    () => {
      return 'hello get profile'
    }
  )
}

export default userRoutes
