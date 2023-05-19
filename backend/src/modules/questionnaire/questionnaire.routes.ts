import type { FastifyInstance } from 'fastify'
import {
  createAnswerHandler,
  createQuestionnaireHandler,
  getAlgorithmHandler,
  getLastAlgorithmHandler,
  getQuestionnaireHandler,
  getQuestionnairesInformationHandler
} from './questionnaire.controllers'
import {
  CreateAnswerSchema,
  CreateQuestionnaireSchema,
  GetAlgorithmSchema,
  GetAlgorithmsSchema,
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

  server.post('/answer',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: CreateAnswerSchema
    },
    createAnswerHandler
  )
  // TODO: ADD ROUTE TO SEND DEFAULT INFORMATION
  server.get('/algorithm/last/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetAlgorithmSchema
    },
    getLastAlgorithmHandler
  )

  server.get('/algorithm/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetAlgorithmsSchema
    },
    getAlgorithmHandler
  )
}

export default questionnaireRoutes
