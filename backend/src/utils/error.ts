class DateFormatError extends Error {
  constructor (message: string) {
    super(message)
    this.message = message
  }
}

class QuestionnaireAlgorithmError extends Error {
  constructor (message: string) {
    super(message)
    this.message = message
  }
}

function errorCodeAndMessage (error: unknown): [number, { message: string }] | unknown {
  console.error(error)
  if (error instanceof DateFormatError) {
    return [400, { message: error.message }]
  } else if (error instanceof QuestionnaireAlgorithmError) {
    return [500, { message: error.message }]
  } else {
    return error
  }
}

export {
  errorCodeAndMessage
}
