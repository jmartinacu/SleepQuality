import fs, { appendFile } from 'node:fs/promises'
import path from 'node:path'
import prisma, { type User, type Session, Answer, QuestionnaireAlgorithm, Questionnaire } from '../../utils/database'
import { calculateBMI, parseDateToString, parseStringToDate } from '../../utils/helpers'
import {
  CreateUserHandlerResponse,
  UpdateSessionInput,
  UpdateUserServiceInput,
  CreateUserServiceInput
} from './user.schemas'
import { CSVError } from '../../utils/error'
import { findQuestionnaireUnique } from '../questionnaire/questionnaire.services'
import { AnswerUser } from '../questionnaire/questionnaire.schemas'

async function createUser (
  userInput: CreateUserServiceInput
):
  Promise<CreateUserHandlerResponse> {
  const { birth: birthString, ...rest } = userInput
  const birth = parseStringToDate(birthString)
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

async function createUserSession (userId: string): Promise<Session> {
  const session = await prisma.session.create({
    data: {
      userId
    }
  })
  return session
}

async function createDoctorSession (doctorId: string): Promise<Session> {
  const session = await prisma.session.create({
    data: {
      doctorId
    }
  })
  return session
}

async function updateUser (
  userId: string,
  dataToUpdate: UpdateUserServiceInput
): Promise<User> {
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
    role: rest.role,
    doctorId: rest.doctorId,
    questionnairesToDo: rest.questionnairesToDo,
    acceptDoctor: rest.acceptDoctor
  }
  if (typeof dataToUpdate.height !== 'undefined' || typeof dataToUpdate.weight !== 'undefined') {
    const { height, weight } = await findUserUnique('id', userId) as User
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

async function updateUsers (
  userIds: string[],
  dataToUpdate: UpdateUserServiceInput[]
): Promise<number> {
  const newDataToUpdate = dataToUpdate
    .map(async (data: UpdateUserServiceInput, index) => {
      let BMI: number | undefined
      if (typeof data.height !== 'undefined' || typeof data.weight !== 'undefined') {
        const userId = userIds.at(index) as string
        const { height, weight } = await findUserUnique('id', userId) as User
        const newHeight = typeof data.height === 'undefined'
          ? height
          : data.height
        const newWeight = typeof data.weight === 'undefined'
          ? weight
          : data.weight
        BMI = calculateBMI({ height: newHeight, weight: newWeight })
      }
      return {
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        password: data.password,
        passwordResetCode: data.passwordResetCode,
        verified: data.verified,
        profilePicture: data.profilePicture,
        chronicDisorders: data.chronicDisorders,
        role: data.role,
        BMI
      }
    })
  const updateCount = await prisma.user.updateMany({
    where: {
      id: {
        in: userIds
      }
    },
    data: newDataToUpdate
  })
  return updateCount.count
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

async function deleteUsers (ids: string[]): Promise<void> {
  const users = await findUserMany('id', ids)
  await prisma.user.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
  await prisma.answer.deleteMany({
    where: {
      userId: {
        in: ids
      }
    }
  })
  users.filter(user => user.profilePicture !== null)
    .forEach((user) => {
      const filePath = path.resolve(`images/${user.profilePicture as string}`)
      void fs.unlink(filePath)
    })
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

async function findUserMany (
  uniqueIdentifier: 'email' | 'id',
  values: string[]
): Promise<User[]> {
  let users: User[]
  if (uniqueIdentifier === 'email') {
    users = await prisma.user.findMany({
      where: {
        email: {
          in: values
        }
      }
    })
  } else {
    users = await prisma.user.findMany({
      where: {
        id: {
          in: values
        }
      }
    })
  }
  return users
}

async function findSessionUnique (
  uniqueIdentifier: 'id' | 'userId' | 'doctorId',
  value: string
): Promise<Session | null> {
  let session
  if (uniqueIdentifier === 'id') {
    session = await prisma.session.findUnique({
      where: {
        id: value
      }
    })
  } else if (uniqueIdentifier === 'userId') {
    session = await prisma.session.findUnique({
      where: {
        userId: value
      }
    })
  } else {
    session = await prisma.session.findUnique({
      where: {
        doctorId: value
      }
    })
  }

  return session
}

async function findSessionAndUserUnique (
  uniqueIdentifier: 'userId' | 'id',
  value: string
): Promise<Session & { user: User | null } | null> {
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

async function findUserAnswers (userId: string): Promise<Answer[]> {
  const answer = await prisma.answer.findMany({
    where: {
      userId
    }
  })
  return answer
}

async function findUserAlgorithms (userId: string): Promise<QuestionnaireAlgorithm[]> {
  const algorithms = await prisma.questionnaireAlgorithm.findMany({
    where: {
      userId
    }
  })
  return algorithms
}

async function saveCSV (
  userId: string,
  fileName: string,
  mode: 'all' | 'answers' | 'algorithms'
): Promise<void> {
  try {
    let answers: Answer[]
    let algorithms: QuestionnaireAlgorithm[]
    switch (mode) {
      case 'answers':
        answers = await findUserAnswers(userId)
        await saveAnswersCSV(answers, fileName)
        break
      case 'algorithms':
        algorithms = await findUserAlgorithms(userId)
        await saveAlgorithmsCSV(algorithms, fileName)
        break
      default:
        answers = await findUserAnswers(userId)
        algorithms = await findUserAlgorithms(userId)
        await saveAllCSV(answers, algorithms, fileName)
    }
  } catch (error) {
    throw new CSVError('Store user data in CSV file failed')
  }
}

async function saveAllCSV (
  answers: Answer[],
  algorithms: QuestionnaireAlgorithm[],
  fileName: string
): Promise<void> {
  await saveAnswersCSV(answers, fileName)
  await saveAlgorithmsCSV(algorithms, fileName)
}

async function saveAnswersCSV (answers: Answer[], fileName: string): Promise<void> {
  const csvMap = await transformAnswersToCSVData(answers)

  for (const [header, csvData] of csvMap.entries()) {
    await appendFile(fileName, header)
    await Promise.all(csvData.map(async (line) => {
      await appendFile(fileName, line)
    }))
  }
}

async function transformAnswersToCSVData (
  answers: Answer[]
): Promise<Map<string, string[]>> {
  return await answers.reduce(
    async (accumulator, current) => {
      const { name } = await findQuestionnaireUnique(
        'id',
        current.questionnaireId
      ) as Questionnaire
      const answerWithoutCommas = removeCommasFromAnswer(current)
      const headerAux = answerWithoutCommas.map(data => data.question)
      headerAux.unshift(name)
      headerAux.push('date')
      const newHeader = headerAux.join(',')
      const awaitedAccumulator = await accumulator
      if (!awaitedAccumulator.has(newHeader)) {
        const date = parseDateToString(current.createdAt)
        const responses = answerWithoutCommas.map(data => data.response).join(',')
        awaitedAccumulator.set(newHeader, [`${name},${responses},${date}`])
      } else {
        const date = parseDateToString(current.createdAt)
        const responses = answerWithoutCommas.map(data => data.response).join(',')
        awaitedAccumulator.get(newHeader)?.push(`${name},${responses},${date}`)
      }
      return awaitedAccumulator
    }, Promise.resolve(new Map<string, string[]>()))
}

function removeCommasFromAnswer (current: Answer): Array<
{
  question: string
  response: string
} | {
  question: string
  response: boolean | number | null
}
> {
  return Object.entries(current.answers as AnswerUser)
    .map(entry => {
      let newResponse
      const commaGlobalRegex = /,/g
      if (typeof entry[1] === 'string') {
        newResponse = entry[1].replace(commaGlobalRegex, '')
        return {
          question: entry[0].replace(commaGlobalRegex, ''),
          response: newResponse
        }
      } else {
        return {
          question: entry[0].replace(commaGlobalRegex, ''),
          response: entry[1]
        }
      }
    })
}

async function saveAlgorithmsCSV (
  algorithms: QuestionnaireAlgorithm[],
  fileName: string
): Promise<void> {
  const { header, algorithmsCSVData } = transformAlgorithmsToCSVData(algorithms)
  await appendFile(fileName, header)
  await Promise.all(algorithmsCSVData.map(async (line) => {
    await appendFile(fileName, line)
  }))
}

function transformAlgorithmsToCSVData (
  algorithms: QuestionnaireAlgorithm[]
): {
    header: string
    algorithmsCSVData: string[]
  } {
  const algorithmsCSVData = algorithms.map(algorithm => {
    return [
      algorithm.athensInsomniaScale,
      algorithm.epworthSleepinessScaleRisk,
      algorithm.epworthSleepinessScaleWarning,
      algorithm.insomniaSeverityIndexRisk,
      algorithm.insomniaSeverityIndexWarning,
      algorithm.internationalRestlessLegsScale,
      algorithm.perceivedStressQuestionnaire,
      algorithm.pittsburghSleepQualityIndex,
      algorithm.stopBangRisk,
      algorithm.stopBangWarning,
      parseDateToString(algorithm.createdAt)
    ].join(',')
  })

  const header = 'athensInsomniaScale,epworthSleepinessScaleRisk,epworthSleepinessScaleWarning,insomniaSeverityIndexRisk,insomniaSeverityIndexWarning,internationalRestlessLegsScale,perceivedStressQuestionnaire,pittsburghSleepQualityIndex,stopBangRisk,stopBangWarning,date'
  return { header, algorithmsCSVData }
}

export {
  createUser,
  createUserSession,
  createDoctorSession,
  updateUser,
  updateUsers,
  deleteUser,
  deleteUsers,
  findUserUnique,
  findUserUniqueOrThrow,
  findUserMany,
  findSessionUnique,
  updateSession,
  findSessionAndUserUnique,
  findUserAnswers,
  findUserAlgorithms,
  saveCSV
}
