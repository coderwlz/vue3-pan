import { msiRequest } from '../index'

export async function getShareList(): Promise<any> {
  return msiRequest.get({
    url: '/api/link/list'
  })
}

export async function closeShareLink(id: string): Promise<any> {
  return msiRequest.get({
    url: '/api/link/del',
    params: {
      id
    }
  })
}

export async function getLinkInfo(key: string, pwd: string): Promise<any> {
  return msiRequest.get({
    url: '/api/link/open',
    params: {
      key,
      pwd
    }
  })
}

export async function saveLinkFile(
  key: string,
  pwd: string,
  target_id: string
): Promise<any> {
  return msiRequest.post({
    url: '/api/link/save',
    params: {
      key,
      pwd,
      target_id
    }
  })
}
