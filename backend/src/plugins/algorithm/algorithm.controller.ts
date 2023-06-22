import type { Questionnaire } from '../../utils/database'
import { parseStringToDate } from '../../utils/helpers'
import type {
  AdditionalInformation,
  AnswerEpworthSleepinessScale,
  AnswerStopBang,
  AnswerUser,
  EpworthSleepinessScaleWarning,
  InsomniaSeverityIndexWarning,
  PerceivedStressQuestionnaireAnswer,
  StopBangWarning
} from '../../modules/questionnaire/questionnaire.schemas'
import {
  createAlgorithmData,
  findQuestionnaireUnique
} from '../../modules/questionnaire/questionnaire.services'
import { QuestionnaireAlgorithmError } from '../../utils/error'

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
  const { additionalInformation } = await findQuestionnaireUnique('id', questionnaireId) as Questionnaire
  const scores = (additionalInformation as AdditionalInformation).at(0)?.relation as Record<string, number>
  const risk = Object.entries((answer as AnswerEpworthSleepinessScale))
    .reduce((accumulator, current) => {
      return accumulator + scores[current[1]]
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
  const { additionalInformation, name } = await findQuestionnaireUnique('id', questionnaireId) as Questionnaire
  const scores = (additionalInformation as AdditionalInformation)
    .reduce<Array<{ questions: number[], relation: Record<string, number> }>>(
    (accumulator, current) => {
      const C1Boolean = current.questions.includes(17) && 'relation' in current
      const C2Boolean = current.questions.includes(4) && 'relation' in current
      const C3Boolean = current.questions.includes(16) && 'relation' in current
      if (C1Boolean || C2Boolean || C3Boolean) {
        accumulator.push({
          questions: current.questions,
          relation: current.relation as Record<string, number>
        })
      }
      return accumulator
    }, [])
  const answerEntries = Object.entries(answer)
  const q17Scores = scores.find(information => information.questions.includes(17))?.relation
  if (typeof q17Scores === 'undefined') {
    throw new QuestionnaireAlgorithmError(
      'Database error',
      name,
      answerEntries.at(17)?.[0] as string
    )
  }
  const C1 = q17Scores[answerEntries.at(17)?.[1] as string]
  const q4Scores = scores.find(information => information.questions.includes(4))?.relation
  if (typeof q4Scores === 'undefined') {
    throw new QuestionnaireAlgorithmError(
      'Database error',
      name,
      answerEntries.at(4)?.[0] as string
    )
  }
  const q1Value = answerEntries.at(1)?.[1] as number
  let C2Aux = q4Scores[answerEntries.at(4)?.[1] as string]
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
  const q3Value = answerEntries.at(3)?.[1] as number
  let C3 = 0
  if (q3Value > 6 && q3Value <= 7) C3 += 1
  else if (q3Value >= 5 && q3Value <= 6) C3 += 2
  else C3 += 3
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
  const C5Aux = answerEntries.reduce((accumulator, current, index) => {
    if ([5, 6, 7, 8, 9, 10, 11, 12, 13].includes(index)) {
      accumulator += q4Scores[current[1] as string]
    }
    return accumulator
  }, 0)
  let C5 = 0
  if (C5Aux >= 1 && C5Aux <= 9) C5 += 1
  else if (C5Aux >= 10 && C5Aux <= 18) C5 += 2
  else C5 += 3
  const C6 = q4Scores[answerEntries.at(14)?.[1] as string]
  const q16Scores = scores.find(information => information.questions.includes(16))?.relation
  if (typeof q16Scores === 'undefined') {
    throw new QuestionnaireAlgorithmError(
      'Database error',
      name,
      answerEntries.at(16)?.[0] as string
    )
  }
  let C7: number
  let C7Aux = q4Scores[answerEntries.at(15)?.[1] as string]
  C7Aux += q16Scores[answerEntries.at(16)?.[1] as string]
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
  await createAlgorithmData(
    { pittsburghSleepQualityIndex: C1 + C2 + C3 + C4 + C5 + C6 + C7 },
    userId,
    questionnaireId
  )
}

async function PerceivedStressQuestionnaireAlgorithm (
  answer: PerceivedStressQuestionnaireAnswer,
  questionnaireId: string,
  userId: string
): Promise<void> {
  const { additionalInformation } = await findQuestionnaireUnique('id', questionnaireId) as Questionnaire
  const scores = (additionalInformation as AdditionalInformation).at(0)?.relation as Record<string, number>
  const responsesScores = Object.values(answer).map(response => scores[response])

  const totalScore = ((
    (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (responsesScores.at(9)! + responsesScores.at(12)! + responsesScores.at(14)! + responsesScores.at(4)! + responsesScores.at(6)! + responsesScores.at(8)! + (5 - responsesScores.at(0)!) + responsesScores.at(16)! + responsesScores.at(17)! + (5 - responsesScores.at(5)!) + (5 - responsesScores.at(3)!) + (5 - responsesScores.at(13)!) + (5 - responsesScores.at(15)!) + (5 - responsesScores.at(7)!) + (5 - responsesScores.at(11)!) + responsesScores.at(2)! + (5 - responsesScores.at(18)!) + responsesScores.at(19)! + responsesScores.at(10)! + responsesScores.at(1)!
      ) / 20
    ) - 1
  ) / 3) * 100

  const worries = ((
    (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (responsesScores.at(9)! + responsesScores.at(12)! + responsesScores.at(14)! + responsesScores.at(4)! + responsesScores.at(6)!) / 5
    ) - 1
  ) / 3) * 100

  const tension = ((
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ((responsesScores.at(8)! + (5 - responsesScores.at(0)!) + responsesScores.at(16)! + responsesScores.at(17)! + (5 - responsesScores.at(5)!)) / 5) - 1
  ) / 3) * 100

  const joy = ((
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ((responsesScores.at(3)! + responsesScores.at(13)! + responsesScores.at(15)! + responsesScores.at(7)! + responsesScores.at(11)!) / 5) - 1
  ) / 3) * 100

  const requirements = ((
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ((responsesScores.at(2)! + (5 - responsesScores.at(18)!) + responsesScores.at(19)! + responsesScores.at(10)! + responsesScores.at(1)!) / 5) - 1
  ) / 3) * 100

  await createAlgorithmData(
    {
      perceivedStressQuestionnaireRisk: totalScore,
      perceivedStressQuestionnaireEmotions: {
        worries,
        joy,
        tension,
        requirements
      }
    },
    userId,
    questionnaireId
  )
}

async function AthensInsomniaScaleAlgorithm (
  answer: AnswerUser,
  questionnaireId: string,
  userId: string
): Promise<void> {
  const { additionalInformation } = await findQuestionnaireUnique('id', questionnaireId) as Questionnaire
  const result = Object.entries(answer).reduce((accumulator, current, index) => {
    const scores = (additionalInformation as AdditionalInformation)
      .find(information => information.questions.includes(index))
      ?.relation as Record<string, number>
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
      .find(information => information.questions.includes(index))
      ?.relation as Record<string, number>
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
      .find(information => information.questions.includes(index))
      ?.relation as Record<string, number>
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
  'STOP-BANG': StopBangAlgorithm,
  'Epworth Sleepiness Scale': EpworthSleepinessScaleAlgorithm,
  'Pittsburgh Sleep Quality Index': PittsburghSleepQualityIndexAlgorithm,
  'Perceived Stress Questionnaire': PerceivedStressQuestionnaireAlgorithm,
  'Athens Insomnia Scale': AthensInsomniaScaleAlgorithm,
  'International Restless Legs Scale': InternationalRestlessLegsScaleAlgorithm,
  'Insomnia Severity Index': InsomniaSeverityIndexAlgorithm
}

export default questionnairesAlgorithms
