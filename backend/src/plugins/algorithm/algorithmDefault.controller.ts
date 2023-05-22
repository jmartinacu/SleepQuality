import type {
  Questions,
  DefaultAlgorithmInformation
} from '../../modules/questionnaire/questionnaire.schemas'
import type { Questionnaire, User } from '../../utils/database'
import {
  findQuestionnaireUnique
} from '../../modules/questionnaire/questionnaire.services'
import { findUserUnique } from '../../modules/user/user.services'
import { calculateAgeFromBirthDate, parseDateToString } from '../../utils/helpers'

async function StopBangDefaultInformation (
  questionnaireId: string,
  userId: string
): Promise<DefaultAlgorithmInformation> {
  const result: DefaultAlgorithmInformation = []
  const { BMI, birth, gender } = await findUserUnique('id', userId) as User
  const { questions } = await findQuestionnaireUnique('id', questionnaireId) as Questionnaire
  result.push({
    index: 4,
    question: Object.entries(questions as Questions).at(4)?.[0] as string,
    answer: BMI > 35,
    dbInformation: BMI
  })
  /**
   * THIS IS NOT 100% ACCURATE IF WE NEED MORE PRECISION WE SHOULD USE
   * A LIBRARY TO MANAGE DATES
   */
  result.push({
    index: 5,
    question: Object.entries(questions as Questions).at(5)?.[0] as string,
    answer: calculateAgeFromBirthDate(birth) > 50,
    dbInformation: parseDateToString(birth)
  })
  result.push({
    index: 7,
    question: Object.entries(questions as Questions).at(7)?.[0] as string,
    answer: gender === 'MASCULINE',
    dbInformation: gender
  })
  return result
}

const questionnairesDefaultInformation = {
  'Consensus Sleep Diary': () => [],
  'STOP-BANG': StopBangDefaultInformation,
  'Epworth Sleepiness Scale': () => [],
  'Pittsburgh Sleep Quality Index': () => [],
  'Perceived Stress Questionnaire': () => [],
  'Athens Insomnia Scale': () => [],
  'International Restless Legs Scale': () => [],
  'Insomnia Severity Index': () => []
}

export default questionnairesDefaultInformation
