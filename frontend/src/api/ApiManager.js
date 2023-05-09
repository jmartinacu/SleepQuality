import axios from 'axios'

const ApiManager = axios.create({
  baseURL: 'http://127.0.0.1:8080/api',
  responseType: 'json',
  withCredentials: true
})

export default ApiManager
