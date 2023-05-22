import fastifyPlugin from 'fastify-plugin'
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions
} from 'fastify'
import questionnairesAlgorithms from './algorithm.controller'
import questionnairesDefaultInformation from './algorithmDefault.controller'

const pluginAlgorithm: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) => {
  fastify.decorate('algorithms', questionnairesAlgorithms)

  fastify.decorate('algorithmDefaults', questionnairesDefaultInformation)
}

export default fastifyPlugin(pluginAlgorithm, {
  fastify: '4.x',
  name: 'serverAlgorithm'
})
