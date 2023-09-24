import MsiRequest from './request'
import { BASE_URL } from './config'
const msiRequest = new MsiRequest({
  baseURL: BASE_URL,
  // timeout: TIME_OUT,
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
      if (error.response.status == 401) {
        window.location.href = '#/login'
      }
      return error
    }
  }
})

export { msiRequest }
