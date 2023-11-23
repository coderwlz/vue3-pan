import { ref } from 'vue'
import { defineStore } from 'pinia'
import { hasOwn } from '@vueuse/shared'
import CryptoJS from 'crypto-js'
import { useFileStore } from './file'
import {
  upload as uploads,
  merge as merges,
  verify
} from '@/service/modules/file'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

export const useUploaderStore = defineStore('uploader', () => {
  const userStore = useUserStore()

  const list = ref<any[]>([])

  const store = useFileStore()
  const router = useRouter()

  const isFolder = ref(false) //

  const join = (arr: any[]) => {
    if (arr.length == 0) {
      return ''
    }
    return JSON.stringify(arr)
  }

  const close = (index: number) => {
    const obj = list.value[index]
    obj.pause()
    list.value.splice(index, 1)
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
        const obj = new File(
          result.files[i],
          join(store.path),
          store.parent_id || userStore.user.id
        )
        list.value.push(obj)
        list.value[list.value.length - 1].start()
      }
    }

    input.value = ''
    input.click()
  }

  const openFilePath = (file: any) => {
    router.push({
      name: 'home',
      query: {
        id: file.parent_id
      }
    })
    store.parent_id = file.parent_id
    store.getList(file.parent_id)
    store.getPath()
  }

  return { list, open, close, openFilePath }
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
  err: string
  parent_id: string
  abort: any
  constructor(file: any, path: string, parent_id: string) {
    this.size = file.size
    this.name = file.name
    this.status = 'pending'
    this.progress = 0
    this.file = file
    this.chunkList = this.createFileChunk(file, File.SliceSize)
    this.hash = ''
    this.path = path
    this.err = ''
    this.parent_id = parent_id
  }

  static SliceSize = 1024 * 1024 * 10

  static STATUS = {
    PENDING: 'pending',
    PAUSED: 'paused',
    PAUSED2: 'paused2',
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
    // const store = useFileStore()
    // const parent_id = store.parent_id || '1'
    const res = await verify(hash, name, this.path, this.parent_id)
    return res.data.presence
  }

  async start() {
    if (this._fileisName()) {
      // 检查 文件是否存在同名的
      return
    }

    if (!this._fileCountIntercept()) {
      // 限制同时计算hash 5个
      return
    }

    this.hash = await this.calculateMd5() //  计算hash

    if (!this.hash) {
      return
    }
    const is = await this.verifyFile(this.hash, this.name)
    if (is) {
      this._updateStatus(STATUS.SUCCESS2)
      this.progress = 1
      const store = useFileStore()
      store.getList()
      this._fileInspect()
      return
    }

    if (!this._fileIntercept()) {
      return
    }

    await this.upload()

    this._fileInspect()
  }

  async pause() {
    try {
      this.abort()
      this._updateStatus(STATUS.PAUSED2)
    } catch (e) {
      this._updateStatus(STATUS.ERROR)
    }
  }

  async resume() {
    try {
      this._updateStatus(STATUS.UPLOADING)
      // TODO 开始重新上传
      if (this.hash) {
        this.upload()
      } else {
        this.start()
      }
    } catch (e) {
      this._updateStatus(STATUS.ERROR)
    }
  }

  async calculateMd5() {
    const file = this.file
    const CHUNK_SIZE = 1024 * 1024 // 1MB
    this._updateStatus(STATUS.CHECKSUM)
    const reader = new FileReader()
    const hash = await this._getFileChunk(reader, CHUNK_SIZE, file)
    if (this.status == STATUS.PAUSED || this.status == STATUS.PAUSED2) {
      return
    }
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

    this._prevUploadedSize = uploaded
  }

  async upload(): Promise<any> {
    if (this.status == STATUS.PAUSED || this.status == STATUS.PAUSED2) {
      return
    }
    const chunk = this.chunkList[this.chunkIndex]
    const formData = new FormData()
    formData.append('file', chunk.file)
    formData.append('md5', this.hash)
    formData.append('fileName', this.name)
    formData.append('index', this.chunkIndex + '')
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    let loaded = 0
    // arr.push(
    this.abort = () => {
      source.cancel()
    }
    await uploads(
      formData,
      (progressEvent: any) => {
        // if (this.chunkIndex == count) {
        loaded = progressEvent.loaded
        // }
      },
      source
    )
    this.onProcess(loaded)
    // count++
    if (this.status == STATUS.PAUSED || this.status == STATUS.PAUSED2) {
      return
    }
    this.chunkIndex++
    if (this.chunkIndex == this.chunkList.length) {
      this._updateStatus(STATUS.MERGING)
      await this.merge()
      return
    }
    // )
    // }
    return this.upload()
  }

  async merge() {
    if (this.progress >= 1) {
      const store = useFileStore()
      await merges({
        md5: this.hash,
        fileName: this.name,
        fileChunkNum: File.SliceSize,
        path: this.path,
        parent_id: this.parent_id
      })
      store.getList()
      this._updateStatus(STATUS.SUCCESS)
      this._fileInspect()
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
    return fileChunkList
  }

  _fileCountIntercept() {
    const store = useUploaderStore()
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
    const store = useUploaderStore()
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
    const store = useUploaderStore()
    let count = 0
    for (let i = 0; i < store.list.length; i++) {
      const item = store.list[i]
      const STATUS_MAP = ['uploading', 'merging']
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
    const store = useUploaderStore()
    for (let i = 0; i < store.list.length; i++) {
      const item = store.list[i]
      const STATUS_MAP = ['paused', 'checksum2']
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
    const flag = store.list.some(({ name }) => {
      return this.name == name
    })
    if (flag) {
      this._updateStatus(STATUS.ERROR)
      this.err = '文件已存在'
    }
    return flag
  }
}

export const STATUS = File.STATUS
