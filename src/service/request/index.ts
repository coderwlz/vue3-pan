import axios from 'axios'
import type { AxiosInstance } from 'axios'

import type { MsiRequestConfig } from './type'

const SHOW_LOADING = true

class MsiRequest {
  instance: AxiosInstance
  isShowLoading: boolean = SHOW_LOADING
  constructor(config: MsiRequestConfig) {
    this.instance = axios.create(config)
    this.isShowLoading = config.isShowLoading ?? SHOW_LOADING
    // 实例拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.requestInterceptor,
      config.interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      config.interceptors?.responseInterceptor,
      config.interceptors?.responseInterceptorCatch
    )
    // 全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return error
      }
    )
    this.instance.interceptors.response.use(
      (result: any) => {
        return result.data || result.response.data
      },
      (error) => {
        return error
      }
    )
  }

  request<T>(config: MsiRequestConfig<T>): Promise<T> {
    if (config.interceptors?.requestInterceptor) {
      this.isShowLoading = config.isShowLoading ?? SHOW_LOADING
      config = config.interceptors.requestInterceptor(config)
    }

    return this.instance
      .request<any, T>(config)
      .then((res) => {
        if (config.interceptors?.responseInterceptor) {
          res = config.interceptors.responseInterceptor(res)
        }
        this.isShowLoading = SHOW_LOADING
        return res
      })
      .catch((err) => {
        this.isShowLoading = SHOW_LOADING
        return err
      })
  }

  get<T>(config: MsiRequestConfig<T>): Promise<T> {
    return this.request({
      ...config,
      method: 'GET'
    })
  }
  post<T>(config: MsiRequestConfig<T>): Promise<T> {
    return this.request({
      ...config,
      method: 'POST'
    })
  }
  delete<T>(config: MsiRequestConfig<T>): Promise<T> {
    return this.request({
      ...config,
      method: 'DELETE'
    })
  }
  patch<T>(config: MsiRequestConfig<T>): Promise<T> {
    return this.request({
      ...config,
      method: 'PATCH'
    })
  }
}

export default MsiRequest
