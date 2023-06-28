import axios from 'axios'

const ApiManager = axios.create({
  // baseURL: 'http://10.0.2.2:8080/api',
  baseURL: 'http://141.37.168.26/api',
  responseType: 'json'
})

export default ApiManager
