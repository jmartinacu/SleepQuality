import prisma, { QuestionnaireAlgorithm, type Answer, type Questionnaire } from '../../utils/database'
import { parseStringToDate } from '../../utils/helpers'
import type {
  AdditionalInformation,
  AnswerEpworthSleepinessScale,
  AnswerStopBang,
  AnswerUser,
  CreateAlgorithmInput,
  CreateQuestionnaireInput,
  EpworthSleepinessScaleWarning,
  InsomniaSeverityIndexWarning,
  StopBangWarning
} from './questionnaire.schemas'

async function createQuestionnaire (data: CreateQuestionnaireInput): Promise<Questionnaire> {
  const questionnaire = await prisma.questionnaire.create({
    data
  })
  return questionnaire
}

async function createAnswer (
  questionnaireId: string,
  userId: string,
  answers: AnswerUser
): Promise<Answer> {
  const answer = await prisma.answer.create({
    data: {
      answers,
      questionnaireId,
      userId
    }
  })
  return answer
}

async function createAlgorithmData (
  algorithmData: CreateAlgorithmInput,
  userId: string,
  questionnaireId: string
): Promise<QuestionnaireAlgorithm> {
  const algorithm = await prisma.questionnaireAlgorithm.create({
    data: {
      userId,
      questionnaireId,
      ...algorithmData
    }
  })
  return algorithm
}

async function findQuestionnaireUnique (
  uniqueIdentifier: 'id' | 'name',
  value: string
): Promise<Questionnaire | null> {
  let questionnaire: Questionnaire | null
  if (uniqueIdentifier === 'name') {
    questionnaire = await prisma.questionnaire.findUnique({
      where: {
        name: value
      }
    })
  } else {
    questionnaire = await prisma.questionnaire.findUnique({
      where: {
        id: value
      }
    })
  }
  return questionnaire
}

async function findQuestionnaires (): Promise<Questionnaire[]> {
  const questionnaires = await prisma.questionnaire.findMany()
  return questionnaires
}

async function findQuestionnaireAlgorithmsOrderByCreatedAt (
  userId: string,
  questionnaireId: string
): Promise<QuestionnaireAlgorithm[]> {
  const result = await prisma.questionnaireAlgorithm.findMany({
    where: {
      AND: {
        questionnaireId,
        userId
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return result
}

async function StopBangAlgorithm (
  answer: AnswerUser,
  questionnaireId: string,
  userId: string
): Promise<void> {
  const stop = 'STOP'
  let risk = 0
  let stopCount = 0
  let maleGenderCheck = false
  let BMIGreater35 = false
  let neckSize40OrLargerCheck = false
  for (const [responseKey, responseValue] of Object.entries(answer as AnswerStopBang)) {
    if (responseValue) risk++
    if (stop.includes(responseKey.at(0) as string)) stopCount++
    if (responseValue &&
      responseKey === 'Body Mass Index more than 35 kg/m^2?') {
      BMIGreater35 = true
    }
    if (responseValue &&
      responseKey === 'Neck size large? (Measured around Adams Apple) is your shirt collar 16 inches / 40 cm larger?') {
      neckSize40OrLargerCheck = true
    }
    if (responseValue &&
      responseKey === 'Gender = Male?') {
      maleGenderCheck = true
    }
  }
  let result: StopBangWarning
  if (risk >= 3 && risk <= 4) result = 'OSA - Intermediate Risk'
  else if (risk >= 5 ||
    (stopCount >= 2 &&
      (
        maleGenderCheck ||
        BMIGreater35 ||
        neckSize40OrLargerCheck
      )
    )
  ) result = 'OSA - High Risk'
  else result = 'OSA - Low Risk'
  await createAlgorithmData(
    { stopBangRisk: risk, stopBangWarning: result },
    userId,
    questionnaireId
  )
}

async function EpworthSleepinessScaleAlgorithm (
  answer: AnswerUser,
  questionnaireId: string,
  userId: string
): Promise<void> {
  let result: EpworthSleepinessScaleWarning
  const risk = Object.values(answer as AnswerEpworthSleepinessScale)
    .reduce((accumulator, current) => {
      return accumulator + current
    }, 0)
  if (risk >= 0 && risk <= 5) result = 'Lower Normal Daytime Sleepiness'
  else if (risk >= 6 && risk <= 10) result = 'Higher Normal Daytime Sleepiness'
  else if (risk >= 11 && risk <= 12) result = 'Mild Excessive Normal Daytime Sleepiness'
  else if (risk >= 13 && risk <= 15) result = 'Moderate Excessive Normal Daytime Sleepiness'
  else result = 'Severe Excessive Normal Daytime Sleepiness'
  await createAlgorithmData(
    { epworthSleepinessScaleRisk: risk, epworthSleepinessScaleWarning: result },
    userId,
    questionnaireId
  )
}

// TODO: COMPROBAR LA RESPUESTAS DE FECHAS CUMPLEN EL FORMATO
async function PittsburghSleepQualityIndexAlgorithm (
  answer: AnswerUser,
  questionnaireId: string,
  userId: string
): Promise<void> {
  const { additionalInformation } = await findQuestionnaireUnique('id', questionnaireId) as Questionnaire
  const scores = (additionalInformation as AdditionalInformation)
    .reduce<Array<{ questions: number[], relation: Record<string, number> }>>(
    (accumulator, current) => {
      const C1Boolean = current.questions.includes(17) && 'relation' in current
      const C2Boolean = current.questions.includes(4) && 'relation' in current
      if (C1Boolean || C2Boolean) {
        accumulator.push({
          questions: current.questions,
          relation: current.relation as Record<string, number>
        })
      }
      return accumulator
    }, [])
  // INDEX 17 COMPONENT 1 QUESTION Array<{ questions: number[], relation: Record<string, number> }
  const answerEntries = Object.entries(answer)
  const q17Scores = scores.find(information => information.questions.includes(17))?.relation
  if (typeof q17Scores === 'undefined') {
    console.log(additionalInformation)
    console.error('Error database information')
    return
  }
  const C1 = q17Scores[answerEntries.at(17)?.[0] as string]
  // INDEX 1 AND 4 COMPONENT 2 QUESTION
  const q4Scores = scores.find(information => information.questions.includes(4))?.relation
  if (typeof q4Scores === 'undefined') {
    console.log(additionalInformation)
    console.error('Error database information')
    return
  }
  const q1Value = answerEntries.at(1)?.[1] as number
  let C2Aux = q4Scores[answerEntries.at(4)?.[0] as string]
  let C2: number
  if (q1Value > 60) C2Aux += 3
  else if (q1Value >= 31 && q1Value <= 60) C2Aux += 2
  else if (q1Value >= 16 && q1Value <= 30) C2Aux += 1
  switch (C2Aux) {
    case 1: case 2:
      C2 = 1
      break
    case 3: case 4:
      C2 = 2
      break
    case 5: case 6:
      C2 = 3
      break
    default:
      C2 = 0
  }
  // INDEX 3 COMPONENT 3 QUESTION
  const q3Value = answerEntries.at(3)?.[1] as number
  let C3 = 0
  if (q3Value > 6 && q3Value <= 7) C3 += 1
  else if (q3Value >= 5 && q3Value <= 6) C3 += 2
  else C3 += 3
  // INDEX 0, 2 AND 3 COMPONENT 4 QUESTION
  const hoursSlept = answerEntries.at(3)?.[1] as number
  const timeGoneToBed = parseStringToDate(answerEntries.at(0)?.[1] as string)
  const timeGottenUp = parseStringToDate(answerEntries.at(2)?.[1] as string)
  const timeDiff = Math.abs(timeGottenUp.getTime() - timeGoneToBed.getTime()) // in milliseconds
  const hoursInBed = timeDiff / 3_600_000
  const sleepEfficiency = (hoursSlept / hoursInBed) * 100
  let C4 = 0
  if (sleepEfficiency >= 75 && sleepEfficiency <= 84) C4 += 1
  else if (sleepEfficiency >= 65 && sleepEfficiency <= 74) C4 += 2
  else C4 += 3
  // INDEX 5, 6, 7, 8, 9 , 10, 11, 12 AND 13 COMPONENT 5 QUESTION
  const C5Aux = answerEntries.reduce((accumulator, current, index) => {
    if ([5, 6, 7, 8, 9, 10, 11, 12, 13].includes(index)) {
      accumulator += q4Scores[current[0]]
    }
    return accumulator
  }, 0)
  let C5 = 0
  if (C5Aux >= 1 && C5Aux <= 9) C5 += 1
  else if (C5Aux >= 10 && C5Aux <= 18) C5 += 2
  else C5 += 3
  // INDEX 14 COMPONENT 6 QUESTION
  const C6 = q4Scores[answerEntries.at(14)?.[0] as string]
  // INDEX 15 AND 16 COMPONENT 7 QUESTION
  const q16Scores = scores.find(information => information.questions.includes(16))?.relation
  if (typeof q16Scores === 'undefined') {
    console.log(additionalInformation)
    console.error('Error database information')
    return
  }
  let C7: number
  let C7Aux = q4Scores[answerEntries.at(15)?.[0] as string]
  C7Aux += q16Scores[answerEntries.at(16)?.[0] as string]
  switch (C7Aux) {
    case 1: case 2:
      C7 = 1
      break
    case 3: case 4:
      C7 = 2
      break
    case 5: case 6:
      C7 = 3
      break
    default:
      C7 = 0
  }
  const result = C1 + C2 + C3 + C4 + C5 + C6 + C7
  await createAlgorithmData(
    { pittsburghSleepQualityIndex: result },
    userId,
    questionnaireId
  )
}

async function PerceivedStressQuestionnaireAlgorithm (
  _answer: AnswerUser,
  _questionnaireId: string,
  _userId: string
): Promise<void> {
}

async function AthensInsomniaScaleAlgorithm (
  answer: AnswerUser,
  questionnaireId: string,
  userId: string
): Promise<void> {
  const { additionalInformation } = await findQuestionnaireUnique('id', questionnaireId) as Questionnaire
  const result = Object.entries(answer).reduce((accumulator, current, index) => {
    const scores = (additionalInformation as AdditionalInformation)
      .find(information => {
        return information.questions.includes(index) && information.enum?.includes(current[0])
      })?.relation as Record<string, number>
    accumulator += scores[current[1] as string]
    return accumulator
  }, 0)
  await createAlgorithmData(
    { athensInsomniaScale: result },
    userId,
    questionnaireId
  )
}

async function InternationalRestlessLegsScaleAlgorithm (
  answer: AnswerUser,
  questionnaireId: string,
  userId: string
): Promise<void> {
  const { additionalInformation } = await findQuestionnaireUnique('id', questionnaireId) as Questionnaire
  const result = Object.entries(answer).reduce((accumulator, current, index) => {
    const scores = (additionalInformation as AdditionalInformation)
      .find(information => {
        return information.questions.includes(index) && information.enum?.includes(current[0])
      })?.relation as Record<string, number>
    accumulator += scores[current[1] as string]
    return accumulator
  }, 0)
  await createAlgorithmData(
    { internationalRestlessLegsScale: result },
    userId,
    questionnaireId
  )
}

async function InsomniaSeverityIndexAlgorithm (
  answer: AnswerUser,
  questionnaireId: string,
  userId: string
): Promise<void> {
  const { additionalInformation } = await findQuestionnaireUnique('id', questionnaireId) as Questionnaire
  const risk = Object.entries(answer).reduce((accumulator, current, index) => {
    const scores = (additionalInformation as AdditionalInformation)
      .find(information => {
        return information.questions.includes(index) && information.enum?.includes(current[0])
      })?.relation as Record<string, number>
    accumulator += scores[current[1] as string]
    return accumulator
  }, 0)
  let result: InsomniaSeverityIndexWarning
  if (risk >= 0 && risk <= 7) result = 'No clinically significant insomnia'
  else if (risk >= 8 && risk <= 14) result = 'Subthreshold insomnia'
  else if (risk >= 15 && risk <= 21) result = 'Clinical insomnia (moderate severity)'
  else result = 'Clinical insomnia (severe)'
  await createAlgorithmData(
    { insomniaSeverityIndexRisk: risk, insomniaSeverityIndexWarning: result },
    userId,
    questionnaireId
  )
}

const questionnairesAlgorithms = {
  'Consensus Sleep Diary': () => {},
  'STOP-BANG': StopBangAlgorithm,
  'Epworth Sleepiness Scale': EpworthSleepinessScaleAlgorithm,
  'Pittsburgh Sleep Quality Index': PittsburghSleepQualityIndexAlgorithm,
  'Perceived Stress Questionnaire': PerceivedStressQuestionnaireAlgorithm,
  'Athens Insomnia Scale': AthensInsomniaScaleAlgorithm,
  'International Restless Legs Scale': InternationalRestlessLegsScaleAlgorithm,
  'Insomnia Severity Index': InsomniaSeverityIndexAlgorithm
}

export {
  createQuestionnaire,
  createAnswer,
  createAlgorithmData,
  findQuestionnaireUnique,
  findQuestionnaires,
  findQuestionnaireAlgorithmsOrderByCreatedAt,
  questionnairesAlgorithms
}
