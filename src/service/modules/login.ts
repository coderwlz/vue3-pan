import { msiRequest } from '../index'

export async function login(data: any): Promise<any> {
  return msiRequest.post({
    url: '/login',
    data
  })
}
