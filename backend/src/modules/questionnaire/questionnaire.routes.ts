import type { FastifyInstance } from 'fastify'
import {
  createAnswerHandler,
  createQuestionnaireHandler,
  getQuestionnaireHandler,
  getQuestionnairesInformationHandler
} from './questionnaire.controllers'
import {
  CreateAnswerSchema,
  CreateQuestionnaireSchema,
  GetQuestionnaireSchema,
  GetQuestionnairesInformationSchema
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

  server.get('/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetQuestionnaireSchema
    },
    getQuestionnaireHandler
  )

  server.get('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetQuestionnairesInformationSchema
    },
    getQuestionnairesInformationHandler
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
