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

  // TODO: TEST HAPPY PATH
  server.get('/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetQuestionnaireSchema
    },
    getQuestionnaireHandler
  )

  // TODO: TEST HAPPY PATH
  server.get('/',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetQuestionnairesInformationSchema
    },
    getQuestionnairesInformationHandler
  )

  // TODO: ADD ALGORITHM FUNCTIONALITY WHEN THIS ROUTE IS CALL
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
