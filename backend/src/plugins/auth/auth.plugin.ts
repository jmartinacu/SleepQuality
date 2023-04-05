import fastifyPlugin from 'fastify-plugin'
import { FastifyInstance } from 'fastify/types/instance'
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify/types/plugin'
import { verifyEmailAndPasswordHandler } from './auth.controller'

const pluginAuthorization: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) => {
  fastify.decorate('verifyEmailAndPassword', verifyEmailAndPasswordHandler)
}

export default fastifyPlugin(pluginAuthorization, {
  fastify: '4.x',
  name: 'serverAuth'
})
