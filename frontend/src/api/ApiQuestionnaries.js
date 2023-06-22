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

export const getAllQuestionnaires = async (token) => {
  try {
    const result = await ApiManager('/questionnaires?all=true', {
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

export const doctorGetQuestionnaires = async (token) => {
  try {
    const result = await ApiManager('/doctors/questionnaires', {
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

export const getDefaultInfo = async (token, id) => {
  try {
    const result = await ApiManager(`questionnaires/algorithm/default/${id}`, {
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

export const getAnswers = async (token, id) => {
  try {
    const result = await ApiManager(`users/data/${id}?all=true`, {
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

export const getConsensusMorning = async (token, id) => {
  try {
    const result = await ApiManager('users/data/consensusdiary?type=morning&all=true', {
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

export const getAllCSV = async (token) => {
  try {
    const result = await ApiManager('users/data/csv?data=all', {
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

export const getAllCSVByQuestionnarie = async (token, quest) => {
  try {
    const result = await ApiManager(`users/data/csv?data=all&questionnaire=${quest}`, {
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
