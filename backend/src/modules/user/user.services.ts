import prisma, { type User, type Session } from '../../utils/database'
import { calculateBMI } from '../../utils/helpers'
import type {
  CreateUserInput,
  CreateUserResponseHandler,
  UpdateSessionInput,
  UpdateUserInput
} from './user.schemas'

async function createUser (
  userInput: CreateUserInput
):
  Promise<CreateUserResponseHandler> {
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

async function updateUser (userId: string, data: UpdateUserInput): Promise<User> {
  if (typeof data.height !== 'undefined' || typeof data.weight !== 'undefined') {
    const user = await findUserUnique('id', userId) as User
    const newHeight = typeof data.height === 'undefined' ? user.height : data.height
    const newWeight = typeof data.weight === 'undefined' ? user.weight : data.weight
    const BMI = calculateBMI({ height: newHeight, weight: newWeight })
    data.BMI = BMI
  }
  // HAY QUE VER SI AL UPDATE DE CHRONICLE DISORDERS añadimos las nuevas o
  // las cambiamos todas
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data
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
  findUserUnique,
  findUserUniqueOrThrow,
  findSessionUnique,
  updateSession,
  findSessionAndUserUnique
}
