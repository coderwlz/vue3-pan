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

export async function addHandleFoler(
  name: string,
  id: string | undefined,
  path: string
): Promise<any> {
  return msiRequest.post({
    url: '/api/add-foler',
    data: {
      name,
      id,
      path
    }
  })
}

export async function getFileList(
  id?: string,
  type?: string | undefined
): Promise<any> {
  return msiRequest.get({
    url: '/api/filelist',
    params: {
      id,
      type
    }
  })
}

export async function getFileInfo(id: string): Promise<any> {
  return msiRequest.get({
    url: '/api/file-info',
    params: {
      id
    }
  })
}

export async function delFile(id: string): Promise<any> {
  return msiRequest.delete({
    url: '/api/del-file',
    params: {
      id
    }
  })
}

export async function getFolerList(id?: string): Promise<any> {
  return msiRequest.get({
    url: '/api/folerlist',
    params: {
      id
    }
  })
}

export async function fileCopy(id?: string, target_id?: string): Promise<any> {
  return msiRequest.post({
    url: '/api/copy',
    data: {
      id,
      target_id
    }
  })
}

export async function fileMove(id?: string, target_id?: string): Promise<any> {
  return msiRequest.post({
    url: '/api/move',
    data: {
      id,
      target_id
    }
  })
}
