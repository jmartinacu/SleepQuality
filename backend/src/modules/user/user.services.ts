import prisma from '../../utils/database'
import { CreateUserInput, createUserResponseService } from './user.schemas'

async function createUser (
  userInput: CreateUserInput
):
  Promise<createUserResponseService | undefined> {
  const userBMI = userInput.weight / Math.pow(userInput.height, 2)
  const userToCreate = { ...userInput, BMI: userBMI }
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

export {
  createUser
}
