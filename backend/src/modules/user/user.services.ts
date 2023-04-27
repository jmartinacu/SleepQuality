import fs from 'node:fs/promises'
import path from 'node:path'
import prisma, { type User, type Session } from '../../utils/database'
import { calculateBMI } from '../../utils/helpers'
import type {
  CreateUserInput,
  CreateUserHandlerResponse,
  UpdateSessionInput,
  UpdateUserServiceInput,
  UpdateUserDatabase
} from './user.schemas'

async function createUser (
  userInput: CreateUserInput
):
  Promise<CreateUserHandlerResponse> {
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
      weight: true,
      verificationCode: true
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

async function updateUser (userId: string, dataToUpdate: UpdateUserServiceInput): Promise<User> {
  const { height, weight, chronicDisorders } = await findUserUnique('id', userId) as User
  const { BMI, chronicDisordersToAdd, chronicDisordersToRemove, ...rest } = dataToUpdate
  const data: UpdateUserDatabase = rest
  if (typeof dataToUpdate.height !== 'undefined' || typeof dataToUpdate.weight !== 'undefined') {
    const newHeight = typeof dataToUpdate.height === 'undefined'
      ? height
      : dataToUpdate.height
    const newWeight = typeof dataToUpdate.weight === 'undefined'
      ? weight
      : dataToUpdate.weight
    const BMI = calculateBMI({ height: newHeight, weight: newWeight })
    data.BMI = BMI
  }
  let newChronicDisorders = chronicDisorders
  if (typeof dataToUpdate.chronicDisordersToRemove !== 'undefined') {
    newChronicDisorders = newChronicDisorders.filter(disorder =>
      dataToUpdate.chronicDisordersToRemove?.includes(disorder) === false
    )
    data.chronicDisorders = newChronicDisorders
  }
  if (typeof dataToUpdate.chronicDisordersToAdd !== 'undefined') {
    const disordersToAdd = dataToUpdate.chronicDisordersToAdd
      .filter(disorder => !newChronicDisorders.includes(disorder))
    newChronicDisorders = newChronicDisorders.concat(disordersToAdd)
    data.chronicDisorders = newChronicDisorders
  }
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data
  })
  return user
}

async function deleteUser (id: string): Promise<void> {
  const { answerIds, profilePicture } = await prisma.user.delete({
    where: {
      id
    }
  })
  await prisma.answer.deleteMany({
    where: {
      id: {
        in: answerIds
      }
    }
  })
  if (profilePicture !== null) {
    const filePath = path.resolve(`images/${profilePicture}`)
    await fs.unlink(filePath)
  }
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

async function findSessionUnique (
  uniqueIdentifier: 'id' | 'userId',
  value: string
): Promise<Session | null> {
  let session
  if (uniqueIdentifier === 'id') {
    session = await prisma.session.findUnique({
      where: {
        id: value
      }
    })
  } else {
    session = await prisma.session.findUnique({
      where: {
        userId: value
      }
    })
  }

  return session
}

async function findSessionAndUserUnique (
  uniqueIdentifier: 'userId' | 'id',
  value: string
): Promise<Session & { user: User } | null> {
  let sessionWithUser
  if (uniqueIdentifier === 'userId') {
    sessionWithUser = await prisma.session.findUnique({
      where: {
        userId: value
      },
      include: {
        user: true
      }
    })
  } else {
    sessionWithUser = await prisma.session.findUnique({
      where: {
        id: value
      },
      include: {
        user: true
      }
    })
  }
  return sessionWithUser
}

async function updateSession (
  sessionId: string,
  data: UpdateSessionInput
): Promise<Session> {
  const session = await prisma.session.update({
    where: {
      id: sessionId
    },
    data
  })
  return session
}

export {
  createUser,
  createSession,
  updateUser,
  deleteUser,
  findUserUnique,
  findUserUniqueOrThrow,
  findSessionUnique,
  updateSession,
  findSessionAndUserUnique
}
