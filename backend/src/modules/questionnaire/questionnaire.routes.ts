import type { FastifyInstance } from 'fastify'
import { getQuestionnaireHandler } from './questionnaire.controllers'

async function questionnaireRoutes (server: FastifyInstance): Promise<void> {
  server.get('/',
    {
    },
    getQuestionnaireHandler
  )
}

export default questionnaireRoutes
