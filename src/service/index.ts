import MsiRequest from './request'
import { BASE_URL, TIME_OUT } from './config'
const msiRequest = new MsiRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor(config) {
      return config
    },
    requestInterceptorCatch(error) {
      return error
    },
    responseInterceptor(result) {
      return result
    },
    responseInterceptorCatch(error) {
      return error
    }
  }
})

export { msiRequest }
