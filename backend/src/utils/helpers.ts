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

function checkTimeDiffDateUntilNow (date: Date, timeInDays: number): boolean {
  const millisecondsToDays = 1000 * 60 * 60 * 24
  const timeDiff = (new Date().getTime() - date.getTime()) / millisecondsToDays
  return timeDiff > timeInDays
}

export {
  calculateBMI,
  checkTimeDiffDateUntilNow
}
