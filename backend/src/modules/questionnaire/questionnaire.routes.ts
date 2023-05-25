import type { FastifyInstance } from 'fastify'
import {
  createAnswerHandler,
  createQuestionnaireHandler,
  getAlgorithmHandler,
  getDefaultAlgorithmInformationHandler,
  getLastAlgorithmHandler,
  getQuestionnaireHandler,
  getUserQuestionnairesInformationHandler
} from './questionnaire.controllers'
import {
  CreateAnswerSchema,
  CreateQuestionnaireSchema,
  GetLastAlgorithmSchema,
  GetAlgorithmSchema,
  GetQuestionnaireSchema,
  GetQuestionnairesInformationSchema,
  GetDefaultAlgorithmInformationSchema
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
    getUserQuestionnairesInformationHandler
  )

  // TODO: ADD TESTING ALGORITHMS
  server.post('/answer',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: CreateAnswerSchema
    },
    createAnswerHandler
  )

  server.get('/algorithm/last/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetLastAlgorithmSchema
    },
    getLastAlgorithmHandler
  )

  server.get('/algorithm/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetAlgorithmSchema
    },
    getAlgorithmHandler
  )

  server.get('/algorithm/default/:id',
    {
      onRequest: server.auth([server.authenticate]),
      preHandler: server.auth([server.checkUserVerification]),
      schema: GetDefaultAlgorithmInformationSchema
    },
    getDefaultAlgorithmInformationHandler
  )
  // TODO: AÑADIR RUTA PARA MANDAR INFORMACION SOBRE COMO HACER LAS PREGUNTSA DE LOS QUESTIONARIOS
  // TODO: SEPARAR CONSESUS SEPARA EN DOS QUESTIONARIOS DE DIA Y NOCHE
}

export default questionnaireRoutes
