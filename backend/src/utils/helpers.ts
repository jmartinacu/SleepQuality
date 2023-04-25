const JPEG_EXTENSIONS = [
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp'
]

const ALLOWED_EXTENSIONS = [
  ...JPEG_EXTENSIONS,
  'png',
  'webp'
]

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

function checkTimeDiffGivenDateUntilNow (date: Date, timeInHours: number): boolean {
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
  checkTimeDiffGivenDateUntilNow,
  random,
  getFileExtension,
  checkFileExtension,
  getMIMEType,
  htmlVerifyUser,
  htmlResetPasswordUser
}
