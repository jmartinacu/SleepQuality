import fs from 'node:fs/promises'
import path from 'node:path'
import prisma, { type User, type Session } from '../../utils/database'
import { calculateBMI } from '../../utils/helpers'
import {
  CreateUserHandlerResponse,
  UpdateSessionInput,
  UpdateUserServiceInput,
  CreateUserServiceInput
} from './user.schemas'

async function createUser (
  userInput: CreateUserServiceInput
):
  Promise<CreateUserHandlerResponse> {
  const { birth: birthString, ...rest } = userInput
  const birth = new Date(birthString)
  const userToCreate = {
    ...rest,
    birth,
    BMI: calculateBMI(userInput)
  }
  const userCreated = await prisma.user.create({
    data: userToCreate,
    select: {
      birth: true,
      BMI: true,
      chronicDisorders: true,
      email: true,
      name: true,
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

async function updateUser (
  userId: string,
  dataToUpdate: UpdateUserServiceInput
): Promise<User> {
  const { height, weight } = await findUserUnique('id', userId) as User
  const { BMI, ...rest } = dataToUpdate
  const data: UpdateUserServiceInput = {
    gender: rest.gender,
    height: rest.height,
    weight: rest.weight,
    password: rest.password,
    passwordResetCode: rest.passwordResetCode,
    verified: rest.verified,
    profilePicture: rest.profilePicture,
    chronicDisorders: rest.chronicDisorders,
    role: rest.role
  }
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
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data
  })
  return user
}

async function deleteUser (id: string): Promise<void> {
  const { profilePicture, answers } = await prisma.user.delete({
    where: {
      id
    },
    include: {
      answers: true
    }
  })
  await prisma.answer.deleteMany({
    where: {
      id: {
        in: answers.map(answer => answer.id)
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
