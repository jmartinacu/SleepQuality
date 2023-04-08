import fastifyPlugin from 'fastify-plugin'
import fastifyBycript from 'fastify-bcrypt'
import fastifyAuth from '@fastify/auth'
import fastifyJwt from '@fastify/jwt'
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply
} from 'fastify'
import { verifyEmailAndPasswordHandler } from './auth.controller'

const pluginAuthorization: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) => {
  void fastify.register(fastifyBycript, {
    saltWorkFactor: 12
  })

  void fastify.register(fastifyJwt, {
    secret: 'secreto que vendrá del .env'
  })

  void fastify.register(fastifyAuth, {
    defaultRelation: 'and'
  })

  fastify.decorate('authenticate', async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      await request.jwtVerify()
    } catch (error) {
      return await reply.send(error)
    }
  })

  fastify.decorate('verifyEmailAndPassword', verifyEmailAndPasswordHandler)
}

export default fastifyPlugin(pluginAuthorization, {
  fastify: '4.x',
  name: 'serverAuth'
})
