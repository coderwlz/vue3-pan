import { msiRequest } from '../index'

export async function upload(data: any, onUploadProgress: any): Promise<any> {
  return msiRequest.post({
    url: '/api/upload',
    data,
    onUploadProgress
  })
}

export async function merge(data: any): Promise<any> {
  return msiRequest.post({
    url: '/api/merge',
    data
  })
}

export async function verify(md5: string, fileName: string): Promise<any> {
  return msiRequest.get({
    url: '/api/verify',
    params: {
      md5,
      fileName
    }
  })
}

export async function getFileList(id: string): Promise<any> {
  return msiRequest.get({
    url: '/api/filelist',
    params: {
      id
    }
  })
}
