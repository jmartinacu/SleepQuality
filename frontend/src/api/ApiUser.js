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

export const userGetProffilePic = async (token) => {
  try {
    const result = await ApiManager('/users/images', {
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

export const userAddProffilePic = async (data, token) => {
  try {
    console.log(data)
    const result = await ApiManager('/users/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
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

export const userGetUserData = async (token) => {
  try {
    const result = await ApiManager('/users', {
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

export const userUpdateUserData = async (data, token) => {
  try {
    const result = await ApiManager('/users', {
      method: 'PATCH',
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

export const userDeleteAccount = async (token) => {
  try {
    const result = await ApiManager('/users', {
      method: 'DELETE',
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

export const userGetNewAccessToken = async (refresh) => {
  try {
    const result = await ApiManager('/users/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Refresh: refresh
      }
    })
    return result
  } catch (err) {
    console.log(err.response)
    return err.response
  }
}

export const userDoctorGetNewAccessToken = async (refresh) => {
  try {
    const result = await ApiManager('/doctors/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Refresh: refresh
      }
    })
    return result
  } catch (err) {
    console.log(err.response)
    return err.response
  }
}

export const userIsAdmin = async (token) => {
  try {
    const result = await ApiManager('/users/admin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + token
      }
    })
    return result
  } catch (err) {
    if (err.response.status !== 403) {
      console.log(err.response)
    }
    return err.response
  }
}

export const userCreateDoctor = async (token, email) => {
  try {
    const result = await ApiManager(`/admins/doctors/${email}`, {
      method: 'POST',
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

export const userLoginDoctor = async (data) => {
  try {
    const result = await ApiManager('/doctors/login', {
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

export const userGetDoctorData = async (token) => {
  try {
    const result = await ApiManager('/doctors', {
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

export const userAddUserToDoctor = async (token, email) => {
  try {
    const result = await ApiManager(`/doctors/users/${email}`, {
      method: 'POST',
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
