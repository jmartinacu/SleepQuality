class DateFormatError extends Error {
  constructor (message: string) {
    super(message)
    this.message = message
  }
}

class QuestionnaireAlgorithmError extends Error {
  algorithm: string
  question: string
  constructor (message: string, algorithm: string, question: string) {
    super(message)
    this.message = message
    this.algorithm = algorithm
    this.question = question
  }
}

class ValidationError extends Error {
  failedValidation: string
  code: number
  reason: string
  constructor (
    message: string,
    failedValidation: string,
    reason: string,
    code: number
  ) {
    super(message)
    this.message = message
    this.failedValidation = failedValidation
    this.reason = reason
    this.code = code
  }
}

class CSVError extends Error {
  reason: string
  constructor (message: string, reason: string) {
    super(message)
    this.message = message
    this.reason = reason
  }
}

function errorCodeAndMessage (error: unknown): [number, { message: string }] | unknown {
  console.error(error)
  console.log('--------------------------------------------')
  if (error instanceof DateFormatError) {
    return [400, { message: error.message }]
  } else if (error instanceof QuestionnaireAlgorithmError) {
    console.info(`Algorithm ${error.algorithm} failed in question:\n ${error.question}`)
    return [500, { message: error.message }]
  } else if (error instanceof ValidationError) {
    console.info(`Validation ${error.failedValidation} failed`)
    console.info(`Cause: ${error.reason}`)
    return [error.code, { message: error.message }]
  } else if (error instanceof CSVError) {
    console.info('Create CSV file failed')
    console.info(error.reason)
    return [500, { message: error.message }]
  } else {
    return error
  }
}

export {
  errorCodeAndMessage,
  DateFormatError,
  QuestionnaireAlgorithmError,
  ValidationError,
  CSVError
}
