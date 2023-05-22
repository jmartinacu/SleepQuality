import ApiManager from './ApiManager'

export const getQuestionnarieById = async (id, token) => {
  console.log(token)
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
