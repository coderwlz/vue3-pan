export function renderSize(bytes: any) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Bytes'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)) + '', 10)
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${parseFloat((bytes / 1024 ** i).toFixed(2))} ${sizes[i]}`
}

export function sizeTostr(size: number) {
  if (!size) {
    size = 0
  }
  let data = ''
  if (size < 1 * 1024) {
    //如果小于1KB转化成B
    // data = size.toFixed(2) + ' B'
    data = Math.trunc(size * 100) / 100 + ' Bytes'
  } else if (size < 1 * 1024 * 1024) {
    //如果小于1MB转化成KB
    // data = Math.trunc(size / 1024).toFixed(2) + ' KB'
    data = Math.trunc((size / 1024) * 100) / 100 + ' KB'
  } else if (size < 1 * 1024 * 1024 * 1024) {
    //如果小于1GB转化成MB
    data = Math.trunc((size / (1024 * 1024)) * 100) / 100 + ' MB'
    // data = (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    //其他转化成GB
    // data = (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    data = Math.trunc((size / (1024 * 1024 * 1024)) * 100) / 100 + ' GB'
  }
  const sizestr = data + ''
  const len = sizestr.indexOf('.')
  const dec = sizestr.substr(len + 1, 2)
  if (dec == '00') {
    //当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 4, 2)
  }
  return sizestr
}

export function timestampToTime(timestamp: number) {
  const date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear() + '-'
  const M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}

// 获取文件后缀
export const getFileSuffix = (name: string) => {
  const dot = name.lastIndexOf('.')
  return name.substr(dot + 1)
}

export function getTimestampAfterNDays(n: number) {
  // 获取当前时间的时间戳
  const currentTime = new Date().getTime()

  // 计算 n 天后的时间戳
  const nDaysLater = currentTime + n * 24 * 60 * 60 * 1000

  return nDaysLater
}

export const copyVal = (str: string) => {
  const inputs = document.createElement('input') //创建节点
  inputs.value = str //给节点赋值
  document.body.appendChild(inputs) //渲染节点(要不然不起作用,可以添加隐藏属性)
  inputs.select() //选中节点
  const actions = document.execCommand('Copy') //指定复制命令(返回的是一个boolean类型)
  inputs && inputs?.parentNode?.removeChild(inputs)
  return !!actions
}

export function getTimeUntilExpiration(timestamp: number): string {
  const now = new Date().getTime()
  const timeUntilExpiration = timestamp - now

  if (timeUntilExpiration <= 0) {
    return '已过期'
  }

  const days = Math.floor(timeUntilExpiration / (1000 * 60 * 60 * 24))
  if (days > 0) {
    return `${days}天后过期`
  }

  const hours = Math.floor(timeUntilExpiration / (1000 * 60 * 60))
  if (hours > 0) {
    return `${hours}小时后过期`
  }

  return '1小时以内过期'
}

// // 使用示例
// const expirationTimestamp = 1637366400000; // 假设这是一个时间戳
// const timeLeft = getTimeUntilExpiration(expirationTimestamp);
// console.log(timeLeft);
