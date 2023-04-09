import prisma, { User, Session } from '../../utils/database'
import { calculateBMI } from '../../utils/helpers'
import {
  CreateUserInput, CreateUserResponseSchema, UpdateUserSchema
} from './user.schemas'

async function createUser (
  userInput: CreateUserInput
):
  Promise<CreateUserResponseSchema> {
  const userToCreate = {
    ...userInput,
    BMI: calculateBMI(userInput)
  }
  const userCreated = await prisma.user.create({
    data: userToCreate,
    select: {
      age: true,
      BMI: true,
      chronicDisorders: true,
      email: true,
      gender: true,
      height: true,
      id: true,
      weight: true
    }
  })
  return userCreated
}

async function createSession (userId: string): Promise<Session> {
  const session = await prisma.session.create({
    data: {
      userId
    }
  })
  return session
}
async function updateUser (userId: string, data: UpdateUserSchema): Promise<User> {
  let BMI
  let dataToUpdate: object = { ...data }
  if (typeof data.height !== 'undefined' || typeof data.weight !== 'undefined') {
    const user = await findUserUnique('id', userId) as User
    const newHeight = typeof data.height === 'undefined' ? user.height : data.height
    const newWeight = typeof data.weight === 'undefined' ? user.weight : data.weight
    BMI = calculateBMI({ height: newHeight, weight: newWeight })
    dataToUpdate = { ...dataToUpdate, BMI }
  }
  // HAY QUE VER SI AL UPDATE DE CHRONICLE DISORDERS añadimos las nuevas o
  // las cambiamos todas
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: dataToUpdate
  })
  return user
}

async function findUserUnique (
  uniqueIdentifier: 'email' | 'id',
  value: string
): Promise<User | null> {
  let user: User | null
  if (uniqueIdentifier === 'email') {
    user = await prisma.user.findUnique({
      where: {
        email: value
      }
    })
  } else {
    user = await prisma.user.findUnique({
      where: {
        id: value
      }
    })
  }
  return user
}

async function findUserUniqueOrThrow (
  uniqueIdentifier: 'email' | 'id',
  value: string
): Promise<User> {
  let user: User
  if (uniqueIdentifier === 'email') {
    user = await prisma.user.findFirstOrThrow({
      where: {
        email: value
      }
    })
  } else {
    user = await prisma.user.findFirstOrThrow({
      where: {
        id: value
      }
    })
  }
  return user
}

export {
  createUser,
  createSession,
  updateUser,
  findUserUnique,
  findUserUniqueOrThrow
}
