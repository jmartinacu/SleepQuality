import {
  AdditionalInformation
} from '../modules/questionnaire/questionnaire.schemas'
import { ALLOWED_EXTENSIONS, JPEG_EXTENSIONS } from '../modules/user/user.schemas'

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
  PRIMARY_NUMBER: (response: any) => typeof response === 'number',
  PRIMARY_BOOL: (response: any) => typeof response === 'boolean',
  SECONDARY_TEXT: (response: any) => typeof response === 'string' || response === null,
  SECONDARY_NUMBER: (response: any) => typeof response === 'number' || response === null,
  SECONDARY_BOOL: (response: any) => typeof response === 'boolean' || response === null
}

function checkAnswersEnums ({
  answerUser,
  index,
  additionalInformation
}:
{
  answerUser: string
  index: number
  additionalInformation: AdditionalInformation }
): boolean {
  const questionUserInformation = additionalInformation
    .find(information => {
      return information.questions
        .includes(index) && Object.prototype.hasOwnProperty.call(information, 'enum')
    })
  return (questionUserInformation?.enum as string[]).includes(answerUser)
}

function checkBirth (birth: string): boolean {
  let result = true
  const birthArray = birth.split('-')
  if (birthArray.some(number => Number.isNaN(Number(number)))) result = false
  if (Number(birthArray[0]) < 1900 || Number(birthArray[0]) > new Date().getFullYear()) {
    result = false
  }
  if (Number(birthArray[1]) < 0 || Number(birthArray[1]) > 12) {
    result = false
  }
  if (Number(birthArray[2]) < 0 || Number(birthArray[2]) > 31) {
    result = false
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
  checkAnswersEnums,
  checkBirth
}
