<script setup lang="ts">
import { ref, watch } from 'vue'
import { createEventHook, hasOwn, isClient } from '@vueuse/shared'
import { upload, merge } from '@/service/modules/file'
import CryptoJS from 'crypto-js'

const defaultDocument = /* #__PURE__ */ isClient ? window.document : undefined

const openFile = () => {
  const files = ref(null)
  const { on: onChange, trigger } = createEventHook()
  let input: any
  let document = defaultDocument

  input = document?.createElement('input')
  input.type = 'file'

  input.onchange = async (event: any) => {
    const result = event.target
    files.value = result.files
    // trigger(files.value)
  }

  const isFolder = ref(false) //

  const open = () => {
    if (!input) return
    const _options = {
      multiple: true,
      accept: '*',
      isFolder: false
    }
    input.multiple = _options.multiple
    input.accept = _options.accept
    if (_options.isFolder) {
      input.setAttribute('webkitdirectory', 'webkitdirectory')
    } else {
      input.removeAttribute('webkitdirectory')
    }
    // if (hasOwn(_options, 'capture')) {
    //   input.capture = _options.capture
    // }
    input.value = null
    input.click()
  }
  const size = 1024 * 1024 * 10

  watch(files, async (newValue: any) => {
    console.log(newValue)
    if (newValue) {
      for (let i = 0; i < newValue?.length; i++) {
        const name = newValue[i].name
        const hash = await calculateMd5(newValue[i])
        console.log('hash', hash)

        let chunkList = createFileChunk(newValue[i], size)
        console.log('chunkList', chunkList)

        for (let j = 0; j < chunkList?.length; j++) {
          const formData = new FormData()
          formData.append('file', chunkList[j].file)
          formData.append('md5', hash)
          formData.append('fileName', name)
          formData.append('index', j + '')
          await upload(formData)
        }
        await merge({
          md5: hash,
          fileName: name,
          // fileChunkNum: chunkList.length
          fileChunkNum: size
        })
      }
    }
  })
  open()
}

const createFileChunk = (file: any, size: any) => {
  const fileChunkList = []
  var count = 0
  while (count < file.size) {
    fileChunkList.push({
      file: file.slice(count, count + size)
    })
    count += size
  }
  console.log('createFileChunk -> fileChunkList', fileChunkList)
  return fileChunkList
}

const calculateMd5 = async (file: any) => {
  const hash = await _calculateMd5(file)

  return hash
}
const _calculateMd5 = async (file: any) => {
  const CHUNK_SIZE = 1024 * 1024 // 1MB
  const reader = new FileReader()
  const hash = await _getFileChunk(reader, CHUNK_SIZE, file)
  return hash
}
const _getFileChunk = async (reader: any, chunkSize: any, file: any) => {
  let offset = 0
  let hash = CryptoJS.algo.SHA256.create()
  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize)
    reader.readAsArrayBuffer(chunk)
    await new Promise(
      (resolve) =>
        (reader.onload = (e: any) => {
          var chunk = CryptoJS.lib.WordArray.create(e.target.result) // 将文件块转换为WordArray
          hash.update(chunk) // 更新哈希值
          return resolve('')
        })
    )

    offset += chunkSize
    // this.progress = offset / this.file.size
    console.log('计算中', offset / file.size)
  }
  let finalHash = hash.finalize()
  return finalHash.toString()
}
</script>

<template>
  <main>
    <button @click="openFile">上传</button>
  </main>
</template>
