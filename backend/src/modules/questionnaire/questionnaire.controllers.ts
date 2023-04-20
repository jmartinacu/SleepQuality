import type { FastifyReply, FastifyRequest } from 'fastify'

function getQuestionnaireHandler (
  _request: FastifyRequest,
  _reply: FastifyReply
): string {
  return 'hello questionnaire'
}

export {
  getQuestionnaireHandler
}
