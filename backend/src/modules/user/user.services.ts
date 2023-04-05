import prisma, { User } from '../../utils/database'
import {
  CreateUserInput,
  CreateUserResponseService,
  FindUserUniqueIdentifier
} from './user.schemas'

async function createUser (
  userInput: CreateUserInput
):
  Promise<CreateUserResponseService | undefined> {
  const userBMI = userInput.weight / Math.pow(userInput.height, 2)
  const userToCreate = { ...userInput, BMI: Number(userBMI.toFixed(3)) }
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

async function findUserUnique (
  uniqueIdentifier: FindUserUniqueIdentifier,
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
  uniqueIdentifier: FindUserUniqueIdentifier,
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
  findUserUnique,
  findUserUniqueOrThrow
}
