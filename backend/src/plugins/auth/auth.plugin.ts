import fastifyPlugin from 'fastify-plugin'
import fastifyBcrypt from 'fastify-bcrypt'
import fastifyAuth from '@fastify/auth'
import fastifyJwt from '@fastify/jwt'
import config from 'config'
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions
} from 'fastify'
import {
  verifyEmailAndPasswordHandler,
  userVerified,
  isAdmin,
  verifySession,
  verifyAuthorizationHeader
} from './auth.controller'

const pluginAuthorization: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) => {
  void fastify.register(fastifyBcrypt, {
    saltWorkFactor: 12
  })

  const accessKey = Buffer
    .from(config.get<string>('accessTokenKey'), 'base64')
    .toString('ascii')

  const refreshKey = Buffer
    .from(config.get<string>('refreshTokenKey'), 'base64')
    .toString('ascii')

  void fastify.register(fastifyJwt, {
    secret: accessKey,
    sign: {
      expiresIn: '10m'
    },
    namespace: 'access',
    jwtVerify: 'accessVerify',
    jwtSign: 'accessSign'
  })

  void fastify.register(fastifyJwt, {
    secret: refreshKey,
    namespace: 'refresh',
    jwtVerify: 'refreshVerify',
    jwtSign: 'refreshSign'
  })

  void fastify.register(fastifyAuth, {
    defaultRelation: 'and'
  })

  fastify.decorate('authenticate', verifyAuthorizationHeader)

  fastify.decorate('checkEmailAndPassword', verifyEmailAndPasswordHandler)

  fastify.decorate('checkUserVerification', userVerified)

  fastify.decorate('checkAdmin', isAdmin)

  fastify.decorate('checkSession', verifySession)
}

export default fastifyPlugin(pluginAuthorization, {
  fastify: '4.x',
  name: 'serverAuth'
})
