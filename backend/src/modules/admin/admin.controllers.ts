import type { FastifyRequestTypebox, FastifyReplyTypebox } from '../../server'
import { findUserUnique, updateUser, updateUsers } from '../user/user.services'
import { UpdateUserServiceInput } from '../user/user.schemas'
import { CreateAdminDoctorSchema, CreateManyDoctorsSchema, MessageResponseSchema } from './admin.schemas'
import { errorCodeAndMessage } from '../../utils/error'

async function createAdminHandler (
  request: FastifyRequestTypebox<typeof CreateAdminDoctorSchema>,
  reply: FastifyReplyTypebox<typeof CreateAdminDoctorSchema>
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
  request: FastifyRequestTypebox<typeof CreateAdminDoctorSchema>,
  reply: FastifyReplyTypebox<typeof CreateAdminDoctorSchema>
): Promise<MessageResponseSchema> {
  try {
    const { id } = request.params
    const user = await findUserUnique('id', id)
    if (user == null) {
      return await reply.code(404).send({ message: 'User not found' })
    }
    await updateUser(id, { role: 'DOCTOR' })
    return await reply.code(201).send({ message: 'Doctor created' })
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
    const dataToUpdate: UpdateUserServiceInput[] = []
    for (let i = 0; i < ids.length; i++) {
      const id = ids.at(i) as string
      const user = await findUserUnique('id', id)
      if (user == null) {
        return await reply.code(404).send({ message: 'User not found' })
      }
      dataToUpdate.push({ role: 'DOCTOR' })
    }
    await updateUsers(ids, dataToUpdate)
    return await reply.code(201).send({ message: 'Doctors created' })
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
