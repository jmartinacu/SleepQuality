import type { FastifyRequestTypebox, FastifyReplyTypebox } from '../../server'
import { findUserUnique, updateUser, updateUsers } from '../user/user.services'
import { UpdateUserServiceInput } from '../user/user.schemas'
import { CreateAdminDoctorSchema, CreateManyDoctorsSchema, MessageResponseSchema } from './admin.schemas'

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
    console.error(error)
    return await reply.code(500).send(error)
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
    console.error(error)
    return await reply.code(500).send(error)
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
    console.error(error)
    return await reply.code(500).send(error)
  }
}

export {
  createAdminHandler,
  createDoctorHandler,
  createManyDoctorHandler
}
