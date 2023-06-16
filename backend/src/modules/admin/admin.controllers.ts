import type { FastifyRequestTypebox, FastifyReplyTypebox } from '../../server'
import { findUserUnique, updateUser } from '../user/user.services'
import {
  CreateAdminSchema,
  MessageResponseSchema
} from './admin.schemas'
import { errorCodeAndMessage } from '../../utils/error'
import { createDoctor, createManyDoctors } from '../doctor/doctor.services'
import { CreateDoctorSchema, CreateManyDoctorsSchema, DoctorResponse } from '../doctor/doctor.schemas'
import { parseDateToString } from '../../utils/helpers'
import { findAnswersUser } from '../questionnaire/questionnaire.services'

async function createAdminHandler (
  request: FastifyRequestTypebox<typeof CreateAdminSchema>,
  reply: FastifyReplyTypebox<typeof CreateAdminSchema>
): Promise<MessageResponseSchema> {
  try {
    const { id } = request.params
    const user = await findUserUnique('id', id)
    if (user == null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    await updateUser(id, { role: 'ADMIN' })
    return await reply.code(201).send({ message: 'Admin created' })
  } catch (error) {
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
  }
}

async function createDoctorHandler (
  request: FastifyRequestTypebox<typeof CreateDoctorSchema>,
  reply: FastifyReplyTypebox<typeof CreateDoctorSchema>
): Promise<DoctorResponse> {
  try {
    const { email } = request.params
    const user = await findUserUnique('email', email)
    if (user === null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    const answers = await findAnswersUser(user.id)
    if (answers.length !== 0) {
      return await reply.code(400).send({ message: 'This user cannot be a doctor' })
    }
    const doctor = await createDoctor(user.id)
    const { birth, ...rest } = doctor
    return await reply.code(201).send({ birth: parseDateToString(birth), ...rest })
  } catch (error) {
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
  }
}

async function createManyDoctorHandler (
  request: FastifyRequestTypebox<typeof CreateManyDoctorsSchema>,
  reply: FastifyReplyTypebox<typeof CreateManyDoctorsSchema>
): Promise<MessageResponseSchema> {
  try {
    const { ids } = request.body
    if (ids.some(async (id) => {
      const user = await findUserUnique('id', id)
      return user === null
    })) {
      return await reply.code(404).send({ message: 'Users not found' })
    }
    const doctors = await createManyDoctors(ids)
    return await reply.code(201).send(doctors)
  } catch (error) {
    const processedError = errorCodeAndMessage(error)
    let code = 500
    let message = error
    if (Array.isArray(processedError)) {
      const [errorCode, errorMessage] = processedError
      code = errorCode
      message = errorMessage
    }
    return await reply.code(code).send(message)
  }
}

export {
  createAdminHandler,
  createDoctorHandler,
  createManyDoctorHandler
}
