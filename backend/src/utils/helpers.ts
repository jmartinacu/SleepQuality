import {
  AdditionalInformation
} from '../modules/questionnaire/questionnaire.schemas'
import { ALLOWED_EXTENSIONS, JPEG_EXTENSIONS, regexDate } from '../modules/user/user.schemas'

function calculateBMI ({
  weight,
  height
}: {
  weight: number
  height: number
}): number {
  const BMI = weight / Math.pow(height, 2)
  return Number(BMI.toFixed(3))
}

const checkAnswerTypes = {
  PRIMARY_TEXT: (response: any) => typeof response === 'string',
  PRIMARY_NUMBER: (response: any) => {
    if (typeof response !== 'string') return false
    return !isNaN(Number(response)) && !isNaN(parseFloat(response))
  },
  PRIMARY_BOOL: (response: any) => {
    if (typeof response !== 'string') return false
    return response === 'true' || response === 'false'
  },
  SECONDARY_TEXT: (response: any) => typeof response === 'string' || response === null,
  SECONDARY_NUMBER: (response: any) => {
    if (typeof response !== 'string') return false
    return (!isNaN(Number(response)) && !isNaN(parseFloat(response))) || response === null
  },
  SECONDARY_BOOL: (response: any) => {
    if (typeof response !== 'string') return false
    return response === 'true' || response === 'false' || response === null
  }
}

const convertToCorrectType = {
  PRIMARY_TEXT: (response: any) => (response as string).trim(),
  PRIMARY_NUMBER: (response: any) => Number(response),
  PRIMARY_BOOL: (response: any) => {
    if (response === 'false') return false
    else return true
  },
  SECONDARY_TEXT: (response: any) => {
    if (response === null || response === '') return null
    return (response as string).trim()
  },
  SECONDARY_NUMBER: (response: any) => {
    if (response === null) return null
    return Number(response)
  },
  SECONDARY_BOOL: (response: any) => {
    if (response === null) return null
    else if (response === 'false') return false
    else return true
  }
}

function checkAnswersEnums ({
  answerUser,
  index,
  additionalInformation
}:
{
  answerUser: string
  index: number
  additionalInformation: AdditionalInformation
}
): boolean {
  const questionUserInformation = additionalInformation
    .find(information => {
      return information.questions
        .includes(index) && 'enum' in information
    })
  if (typeof questionUserInformation === 'undefined') return false
  return (questionUserInformation.enum as string[]).includes(answerUser)
}

function checkBirth (birth: string): boolean {
  // DD/MM/YYYY-HH:MM
  let result = true
  const [DayMonthYear] = birth.split('-')
  const birthArray = DayMonthYear.split('/')
  if (birthArray.some(number => Number.isNaN(Number(number)))) result = false
  if (Number(birthArray[0]) <= 0 || Number(birthArray[0]) > 31) {
    result = false
  }
  if (Number(birthArray[1]) <= 0 || Number(birthArray[1]) > 12) {
    result = false
  }
  if (Number(birthArray[2]) < 1900 || Number(birthArray[2]) > new Date().getFullYear()) {
    result = false
  }
  return result
}

function parseDateToString (date: Date): string {
  const dateStringBackend = date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  const [dateString, timeString] = dateStringBackend.split(',')
  return `${dateString}-${timeString.trim()}`
}

function parseStringToDate (date: string): Date {
  if (!regexDate.test(date)) {
    console.log(regexDate.test(date))
    throw new Error('Wrong date format')
  }
  const [DayMonthYear, HourMinute] = date.split('-')
  const [day, month, year] = DayMonthYear.split('/')
  const [hour, minute] = HourMinute.split(':')

  const newStringDate = `${year}-${month}-${day}T${hour}:${minute}`

  return new Date(newStringDate)
}

function calculateAgeFromBirthDate (birth: Date): number {
  const today = new Date()
  let result = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    result--
  }
  return result
}

function checkTimeDiffOfGivenDateUntilNow (date: Date, timeInHours: number): boolean {
  const millisecondsToHours = 1000 * 60 * 60
  const timeDiff = (new Date().getTime() - date.getTime()) / millisecondsToHours
  return timeDiff > timeInHours
}

function random (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getFileExtension (file: string): string {
  return file.slice((file.lastIndexOf('.') - 1 >>> 0) + 2)
}

function getMIMEType (extension: string): 'image/png' | 'image/jpeg' | 'image/webp' {
  if (extension === 'png') return 'image/png'
  else if (JPEG_EXTENSIONS.includes(extension)) return 'image/jpeg'
  else if (extension === 'webp') return 'image/webp'
  else throw new Error('Incorrect file')
}

function checkFileExtension (extension: string): boolean {
  return ALLOWED_EXTENSIONS.includes(extension)
}

function htmlVerifyUser (verificationLink: string): string {
  return `
    <div class="verify-user-card">
      <p>Please click in the following link: </p>
      <a href=${verificationLink}>Click here!!!</a>
    </div>
    <style>
      .verify-user-card {
        display: grid;
        align-items: center;
      }
    </style>
    `
}

function htmlResetPasswordUser (passwordResetCode: number): string {
  return `
    <div class="reset-user-password-card">
      <p>Your reset code is: ${passwordResetCode}</p>
    </div>
    <style>
      .reset-user-password-card {
        display: grid;
        align-items: center;
      }
    </style>
    `
}

export {
  calculateBMI,
  checkTimeDiffOfGivenDateUntilNow,
  random,
  getFileExtension,
  checkFileExtension,
  getMIMEType,
  htmlVerifyUser,
  htmlResetPasswordUser,
  checkAnswerTypes,
  convertToCorrectType,
  checkAnswersEnums,
  checkBirth,
  parseDateToString,
  parseStringToDate,
  calculateAgeFromBirthDate
}
