import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { hasOwn } from '@vueuse/shared'
import CryptoJS from 'crypto-js'
import { useFileStore } from './file'
import {
  upload as uploads,
  merge as merges,
  verify
} from '@/service/modules/file'

export const useUploaderStore = defineStore('uploader', () => {
  const list = ref<any[]>([])

  const store = useFileStore()

  const isFolder = ref(false) //

  const join = (arr: any[]) => {
    if (arr.length == 0) {
      return ''
    }
    return JSON.stringify(arr)
  }

  const open = () => {
    const input = document?.createElement('input')
    input.type = 'file'

    const _options = {
      multiple: true,
      accept: '*',
      isFolder: false
    } as any
    isFolder.value = _options.isFolder ? true : false
    input.multiple = _options.multiple
    input.accept = _options.accept
    if (_options.isFolder) {
      input.setAttribute('webkitdirectory', 'webkitdirectory')
    } else {
      input.removeAttribute('webkitdirectory')
    }
    if (hasOwn(_options, 'capture')) {
      input.capture = _options.capture
    }

    input.onchange = async (event: any) => {
      const result = event.target
      for (let i = 0; i < result.files.length; i++) {
        list.value.push(new File(result.files[i], join(store.path)))
        list.value[i].start()
      }
    }

    input.value = ''
    input.click()
  }

  return { list, open }
})

export class File {
  status: string
  progress: number
  file: any
  chunkList: any[]
  hash: string
  chunkIndex: number = 0
  name: string
  loadedBytes = 0
  size: number
  _lastProgressCallback = Date.now()
  currentSpeed = 0
  _prevUploadedSize = 0
  path: string
  constructor(file: any, path: string) {
    this.size = file.size
    this.name = file.name
    this.status = 'pending'
    this.progress = 0
    this.file = file
    this.chunkList = this.createFileChunk(file, File.SliceSize)
    this.hash = ''
    this.path = path
  }

  static SliceSize = 1024 * 1024 * 10

  static STATUS = {
    PENDING: 'pending',
    PAUSED: 'paused', // todo 暂停之后再做
    CHECKSUM: 'checksum', // 计算
    CHECKSUM2: 'checksum2',
    MERGING: 'merging',
    DECODING: 'decoding',
    UPLOADING: 'uploading',
    SUCCESS: 'success', // 上传成功
    SUCCESS2: 'success2', // 秒传成功
    ERROR: 'error',
    ERROR2: 'error2' // 文件类型错误
  }

  async verifyFile(hash: string, name: string) {
    const res = await verify(hash, name)
    return res.data.presence
  }

  async start() {
    if (this._fileisName()) {
      // 检查 文件是否存在同名的
      return
    }

    console.log('this', this)

    if (!this._fileCountIntercept()) {
      // 限制同时计算hash 5个
      return
    }

    this.hash = await this.calculateMd5() //  计算hash
    console.log('hash', this.hash)

    const is = await this.verifyFile(this.hash, this.name)
    if (is) {
      this._updateStatus(STATUS.SUCCESS2)
      this.progress = 1
      return
    }

    if (!this._fileIntercept()) {
      return
    }

    await this.upload()
    this._updateStatus(STATUS.MERGING)
    await this.merge()

    this._fileInspect()
  }

  async calculateMd5() {
    const file = this.file
    const CHUNK_SIZE = 1024 * 1024 // 1MB
    this._updateStatus(STATUS.CHECKSUM)
    const reader = new FileReader()
    const hash = await this._getFileChunk(reader, CHUNK_SIZE, file)
    // this.progress = 0
    this._updateStatus(STATUS.UPLOADING)
    return hash
  }

  onProcess(loaded: number) {
    this.loadedBytes += loaded
    this.progress = this.loadedBytes / this.size
    this._measureSpeed()
    this._lastProgressCallback = Date.now()
  }

  _measureSpeed() {
    const timeSpan = Date.now() - this._lastProgressCallback
    if (!timeSpan) {
      return
    }
    const uploaded = this.loadedBytes
    // Prevent negative upload speed after file upload resume
    this.currentSpeed = Math.max(
      ((uploaded - this._prevUploadedSize) / timeSpan) * 1000,
      0
    )
    console.log('this.currentSpeed', this.currentSpeed)

    this._prevUploadedSize = uploaded
  }

  async upload() {
    // const arr = []
    console.log('chunkList', this.chunkList)
    let count = 0
    for (let i = 0; i < this.chunkList.length; i++) {
      const formData = new FormData()
      formData.append('file', this.chunkList[i].file)
      formData.append('md5', this.hash)
      formData.append('fileName', this.name)
      formData.append('index', i + '')
      console.log('chunkList' + i)
      let loaded = 0
      // arr.push(
      await uploads(formData, (progressEvent: any) => {
        if (i == count) {
          loaded = progressEvent.loaded
        }
      })
      this.onProcess(loaded)
      count++

      console.log('count', count)

      // )
    }
    // await Promise.all(arr)
    return
  }

  async merge() {
    if (this.progress >= 1) {
      const store = useFileStore()
      await merges({
        md5: this.hash,
        fileName: this.name,
        fileChunkNum: File.SliceSize,
        path: this.path,
        parent_id: store.parent_id || '1'
      })
      store.getList()
      this._updateStatus(STATUS.SUCCESS)
    }
  }

  _updateStatus(status: string) {
    this.status = status
  }

  async _getFileChunk(reader: any, chunkSize: any, file: any) {
    let offset = 0
    const hash = CryptoJS.algo.SHA256.create()
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize)
      reader.readAsArrayBuffer(chunk)
      await new Promise(
        (resolve) =>
          (reader.onload = (e: any) => {
            const chunk = CryptoJS.lib.WordArray.create(e.target.result) // 将文件块转换为WordArray
            hash.update(chunk) // 更新哈希值
            return resolve('')
          })
      )

      offset += chunkSize
      // this.progress = offset / file.size
      // console.log('计算中', offset / file.size)
    }
    const finalHash = hash.finalize()
    return finalHash.toString()
  }

  createFileChunk(file: any, size: any) {
    const fileChunkList = []
    let count = 0
    while (count < file.size) {
      fileChunkList.push({
        file: file.slice(count, count + size)
      })
      count += size
    }
    console.log('createFileChunk -> fileChunkList', fileChunkList)
    return fileChunkList
  }

  _fileCountIntercept() {
    const store = useFileStore()
    let count = 0
    for (let i = 0; i < store.list.length; i++) {
      const item = store.list[i]
      const STATUS_MAP = ['checksum']
      if (STATUS_MAP.includes(item.status)) {
        count++
      }
    }
    if (count > 5) {
      this._updateStatus(STATUS.CHECKSUM2)
      return false
    }
    return true
  }

  _fileCountInspect() {
    const store = useFileStore()
    for (let i = 0; i < store.list.length; i++) {
      const item = store.list[i]
      const STATUS_MAP = ['checksum2']
      if (STATUS_MAP.includes(item.status)) {
        item.start()
        return
      }
    }
    return
  }

  _fileIntercept() {
    const store = useFileStore()
    let count = 0
    for (let i = 0; i < store.list.length; i++) {
      const item = store.list[i]
      const STATUS_MAP = ['uploading', 'merging', 'decoding']
      if (STATUS_MAP.includes(item.status)) {
        count++
      }
    }
    for (let i = 0; i < store.list.length; i++) {
      const item = store.list[i]
      const STATUS_MAP = ['merging', 'decoding', 'uploading']
      if (STATUS_MAP.includes(item.status) && item.hash != this.hash) {
        if (count <= 3) {
          return true
        }
        this._updateStatus(STATUS.PAUSED)
        return false
      }
    }
    return true
  }

  _fileInspect() {
    const store = useFileStore()
    for (let i = 0; i < store.list.length; i++) {
      const item = store.list[i]
      const STATUS_MAP = ['paused']
      if (STATUS_MAP.includes(item.status)) {
        item.start()
        return
      }
    }
    return
  }

  _fileisName() {
    if (this.file?.webkitRelativePath) {
      return false
    }
    const store = useFileStore()
    const flag = store.list.some(({ name }) => this.name == name)
    if (flag) {
      this._updateStatus(STATUS.ERROR)
      console.log('文件已存在')
    }
    return flag
  }
}

export const STATUS = File.STATUS
