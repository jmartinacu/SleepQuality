import ApiManager from './ApiManager'

export const userLogin = async data => {
  try {
    const result = await ApiManager('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      data
    })
    return result
  } catch (err) {
    return err.response.data
  }
}

export const userRegister = async (data) => {
  console.log(data)
  try {
    const result = await ApiManager('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      data
    })
    return result
  } catch (err) {
    console.log(err.response)
    return err.response
  }
}

export const userForgotPass = async (data) => {
  try {
    const result = await ApiManager('/users/forgotpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      data
    })
    return result
  } catch (err) {
    console.log(err.response)
    return err.response
  }
}

export const userChangePass = async (data, code) => {
  try {
    const result = await ApiManager(`/users/resetpassword/${code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      data
    })
    return result
  } catch (err) {
    console.log(err.response)
    return err.response
  }
}
