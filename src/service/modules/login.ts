import { msiRequest } from '../index'

export async function login(data: any) {
  return msiRequest.post({
    url: '/login',
    data
  })
}
