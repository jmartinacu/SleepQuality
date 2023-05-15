import prisma, { type Answer, type Questionnaire } from '../../utils/database'
import type { AnswerStopBang, AnswerUser, CreateQuestionnaireInput } from './questionnaire.schemas'

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

async function StopBangAlgorithm (answer: AnswerUser): Promise<string> {
  const stop = 'STOP'
  let riskCount = 0
  let stopCount = 0
  let maleGenderCheck = false
  let BMIGreater35 = false
  let neckSize40OrLargerCheck = false
  for (const [responseKey, responseValue] of Object.entries(answer as AnswerStopBang)) {
    if (responseValue) riskCount++
    if (stop.includes(responseKey.at(0) as string)) stopCount++
    if (responseValue &&
      responseKey === 'Body Mass Index more than 35 kg/m^2?') BMIGreater35 = true
    if (responseValue &&
      responseKey === 'Neck size large? (Measured around Adams Apple) is your shirt collar 16 inches / 40 cm larger?') neckSize40OrLargerCheck = true
    if (responseValue &&
      responseKey === 'Gender = Male?') maleGenderCheck = true
  }
  let result: string
  if (riskCount >= 3 && riskCount <= 4) result = 'OSA - Intermediate Risk'
  else if (riskCount >= 5 || (stopCount >= 2 && (maleGenderCheck || BMIGreater35 || neckSize40OrLargerCheck))) result = 'OSA - High Risk'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  else result = 'OSA - Low Risk'
  return result
}

async function EpworthSleepinessScaleAlgorithm (_answer: AnswerUser): Promise<void> {

}

async function PittsburghSleepQualityIndexAlgorithm (_answer: AnswerUser): Promise<void> {

}

async function PerceivedStressQuestionnaireAlgorithm (_answer: AnswerUser): Promise<void> {

}

async function AthensInsomniaScaleAlgorithm (_answer: AnswerUser): Promise<void> {

}

async function InternationalRestlessLegsScaleAlgorithm (_answer: AnswerUser): Promise<void> {

}

async function InsomniaSeverityIndexAlgorithm (_answer: AnswerUser): Promise<void> {

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
  findQuestionnaireUnique,
  findQuestionnaires,
  questionnairesAlgorithms
}
