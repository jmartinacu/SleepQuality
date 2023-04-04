import prisma, { User } from '../../database'
import { CreateUserInput } from './user.schemas'

async function createUser (userInput: CreateUserInput): Promise<User | undefined> {
  try {
    const userToCreate = { ...userInput, BMI: 0 }
    const userCreated = await prisma.user.create({
      data: userToCreate
    })
    return userCreated
  } catch (error) {
    console.error(error)
  }
}

export {
  createUser
}
