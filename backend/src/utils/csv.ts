import { AnswerUser } from '../modules/questionnaire/questionnaire.schemas'
import { findQuestionnaireUnique } from '../modules/questionnaire/questionnaire.services'
import { findUserAlgorithms, findUserAnswers } from '../modules/user/user.services'
import { Questionnaire } from './database'
import { appendFile } from 'node:fs/promises'
import { CSVError } from './error'

async function saveCSV (
  userId: string,
  fileName: string,
  mode: 'all' | 'answers' | 'algorithms'
): Promise<void> {
  try {
    switch (mode) {
      case 'answers':
        await saveAnswersCSV(userId, fileName)
        break
      case 'algorithms':
        await saveAlgorithmsCSV(userId, fileName)
        break
      default:
        await saveAllCSV(userId, fileName)
    }
  } catch (error) {
    throw new CSVError('Store user data in CSV file failed')
  }
}

async function saveAllCSV (userId: string, fileName: string): Promise<void> {
  await saveAnswersCSV(userId, fileName)
  await saveAlgorithmsCSV(userId, fileName)
}

async function saveAnswersCSV (userId: string, fileName: string): Promise<void> {
  const answers = await findUserAnswers(userId)
  const answerMap = await answers.reduce(async (accumulator, current) => {
    const { name } = await findQuestionnaireUnique(
      'id',
      current.questionnaireId
    ) as Questionnaire
    const headerAux = Object.keys(current.answers as AnswerUser)
    headerAux.unshift(name)
    const newHeader = headerAux.join(',')
    const awaitedAcc = await accumulator
    if (!awaitedAcc.has(newHeader)) {
      awaitedAcc.set(
        newHeader,
        [`${name},${Object.values(current.answers as AnswerUser).join(',')}`]
      )
    } else {
      awaitedAcc.get(newHeader)
        ?.push(`${name},${Object.values(current.answers as AnswerUser).join(',')}`)
    }
    return awaitedAcc
  }, Promise.resolve(new Map<string, string[]>()))

  for (const [header, data] of answerMap.entries()) {
    await appendFile(fileName, header)
    await Promise.all(data.map(async (line) => {
      await appendFile(fileName, line)
    }))
  }
}

async function saveAlgorithmsCSV (userId: string, fileName: string): Promise<void> {
  const algorithms = await findUserAlgorithms(userId)
  const algorithmsData = algorithms.map(algorithm => {
    return {
      athensInsomniaScale: algorithm.athensInsomniaScale,
      epworthSleepinessScaleRisk: algorithm.epworthSleepinessScaleRisk,
      epworthSleepinessScaleWarning: algorithm.epworthSleepinessScaleWarning,
      insomniaSeverityIndexRisk: algorithm.insomniaSeverityIndexRisk,
      insomniaSeverityIndexWarning: algorithm.insomniaSeverityIndexWarning,
      internationalRestlessLegsScale: algorithm.internationalRestlessLegsScale,
      perceivedStressQuestionnaire: algorithm.perceivedStressQuestionnaire,
      pittsburghSleepQualityIndex: algorithm.pittsburghSleepQualityIndex,
      stopBangRisk: algorithm.stopBangRisk,
      stopBangWarning: algorithm.stopBangWarning
    }
  })

  const header = Object.keys(algorithmsData).join(',')
  await appendFile(fileName, header)
  await Promise.all(algorithmsData.map(async (data) => {
    await appendFile(
      fileName,
      Object.values(data).join(',')
    )
  }))
}

export {
  saveCSV
}
