import ApiManager from './ApiManager'

export const getQuestionnarieById = async (id, token) => {
  try {
    const result = await ApiManager(`/questionnaires/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + token
      }
    })
    return result
  } catch (err) {
    console.log(err.response)
    return err.response
  }
}

export const createAswer = async (token, data) => {
  try {
    const result = await ApiManager('/questionnaires/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + token
      },
      data
    })
    return result
  } catch (err) {
    console.log(err.response)
    return err.response
  }
}

export const getQuestionnaires = async (token) => {
  try {
    const result = await ApiManager('/questionnaires', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + token
      }
    })
    return result
  } catch (err) {
    console.log(err.response)
    return err.response
  }
}
