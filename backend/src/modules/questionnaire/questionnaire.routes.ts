import type { FastifyInstance } from 'fastify'
import { createAnswerHandler, createQuestionnaireHandler } from './questionnaire.controllers'
import {
  CreateAnswerSchema,
  CreateQuestionnaireSchema
} from './questionnaire.schemas'

async function questionnaireRoutes (server: FastifyInstance): Promise<void> {
  server.post('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([
        server.checkUserVerification,
        server.checkAdmin
      ]),
      schema: CreateQuestionnaireSchema
    },
    createQuestionnaireHandler
  )

  server.post('/answer',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: CreateAnswerSchema
    },
    createAnswerHandler
  )
}

export default questionnaireRoutes
