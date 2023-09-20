import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

export interface MsiInterceptors<T> {
  requestInterceptor?: (
    config: InternalAxiosRequestConfig | AxiosRequestConfig
  ) => any
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (result: T) => T
  responseInterceptorCatch?: (error: any) => any
}

export interface MsiRequestConfig<T = AxiosResponse>
  extends AxiosRequestConfig {
  interceptors?: MsiInterceptors<T>
  isShowLoading?: boolean
}
