import { msiRequest } from '../index'

export async function getShareList(): Promise<any> {
  return msiRequest.get({
    url: '/api/link/list'
  })
}
