import renders from './renders.js'

export async function readBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (loadEvent) => resolve(loadEvent.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsArrayBuffer(file)
  })
}

export async function readDataURL(buffer) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (loadEvent) => resolve(loadEvent.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(new Blob([buffer]))
  })
}

export async function readText(buffer) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (loadEvent) => resolve(loadEvent.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsText(new Blob([buffer]), 'utf-8')
  })
}

export function getExtend(name) {
  const dot = name.lastIndexOf('.')
  return name.substr(dot + 1)
}

export async function render(buffer, type, target, file_id) {
  const handler = renders[type]
  if (handler) {
    return handler(buffer, target, file_id)
  }
  return renders.error(buffer, target, type)
}
