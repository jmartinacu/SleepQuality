import { FastifyInstance } from 'fastify'
import {
  createUserHandler,
  logInUserHandler,
  getMeHandler,
  verifyAccountHandler,
  refreshAccessTokenHandler
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
  refreshTokenResponseSchema
} from './user.schemas'

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
      preHandler: server.auth([
        server.authenticate,
        server.checkUserVerification
      ]),
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

  // FALTA RUTA NUEVA CONTRASEÑA
  // QUE VAN A SER DOS RUTAS UNA PARA PEDIR EL CODIGO POR EMAIL
  // Y OTRA PARA VERIFICAR QUE ESE CODIGO ESE CORRECTO Y CAMBIAR LA CONTRASEÑA
}

export default userRoutes
