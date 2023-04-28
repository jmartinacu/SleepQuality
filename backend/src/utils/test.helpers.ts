import { faker } from '@faker-js/faker'
import { random } from './helpers'
import type { Session, User } from './database'
import type { CreateUserInput, CreateUserResponse, Gender, Role } from '../modules/user/user.schemas'

function fakeInputUser (): CreateUserInput {
  const genders = ['MASCULINE', 'FEMININE', 'NEUTER']
  const genderIndex = random(0, 2)
  const email = faker.internet.email()
  const password = 'asdfR2&tr'
  const age = faker.datatype.number({ max: 100 })
  const gender = genders.at(genderIndex) as Gender
  const height = faker.datatype.number({ min: 1, max: 2.5, precision: 0.01 })
  const weight = faker.datatype.number({ min: 20, max: 200, precision: 0.01 })
  const chronicDisorders: string[] = faker.datatype.array(7)
    .filter(disorder => typeof disorder === 'string') as string[]
  return {
    email,
    password,
    age,
    gender,
    height,
    weight,
    chronicDisorders
  }
}

function fakeResponseUser ({
  lengthString = 10,
  maxNumber = 50
}):
  CreateUserResponse & { password: string } {
  const user = fakeInputUser()
  return {
    ...user,
    id: fakerString({ length: lengthString }),
    BMI: fakerNumber({ max: maxNumber })
  }
}

function fakeUser ({
  lengthString = 10,
  maxNumber = 50
}): User {
  const roles = ['ADMIN', 'USER']
  const roleIndex = random(0, 1)
  const userResponse = fakeResponseUser({ lengthString, maxNumber })
  const verificationCode = faker.datatype.string(20)
  const passwordResetCode = random(10000, 99999)
  const verified = faker.datatype.boolean()
  const role = roles.at(roleIndex) as Role
  const profilePicture = faker.datatype.string()
  // const answerIds: string[] = faker.datatype.array(7)
  //   .filter(disorder => typeof disorder === 'string') as string[]
  return {
    ...userResponse,
    verificationCode,
    passwordResetCode,
    verified,
    role,
    profilePicture
  }
}

function fakerString ({ length = 10 }: { length?: number }): string {
  return faker.datatype.string(length)
}

function fakerNumber ({ max = 50 }: { max?: number }): number {
  return faker.datatype.number(max)
}

function fakerSession ({
  lengthString = 10,
  userId
}: {
  lengthString?: number
  userId?: string
}): Session {
  const id = faker.datatype.string(lengthString)
  const valid = faker.datatype.boolean()
  if (typeof userId === 'undefined') userId = faker.datatype.string(lengthString)
  const updatedAt = new Date()
  return {
    id,
    valid,
    updatedAt,
    userId
  }
}

export {
  fakeInputUser,
  fakeResponseUser,
  fakeUser,
  fakerString,
  fakerNumber,
  fakerSession
}
