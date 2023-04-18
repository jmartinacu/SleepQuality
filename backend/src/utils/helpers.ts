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
  htmlVerifyUser,
  htmlResetPasswordUser
}
