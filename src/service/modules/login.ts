import { msiRequest } from '../index'

export async function login(data: any): Promise<any> {
  return msiRequest.post({
    url: '/login',
    data
  })
}

export async function signup(data: any): Promise<any> {
  return msiRequest.post({
    url: '/signup',
    data
  })
}

export async function logout(): Promise<any> {
  return msiRequest.get({
    url: '/api/logout'
  })
}

export async function info(): Promise<any> {
  return msiRequest.get({
    url: '/api/info'
  })
}
