import axios from 'axios'
import { Platform } from 'react-native'

const ApiManager = axios.create({
  // baseURL: 'http://10.0.2.2:8080/api',
  baseURL: Platform.OS === 'web' ? 'http://localhost:8080/api' : 'http://10.0.2.2:8080/api',
  responseType: 'json'
})

export default ApiManager
