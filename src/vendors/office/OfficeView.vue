<template>
  <!-- <DocumentEditor
    v-if="datas?.url"
    id="docEditor"
    :document-server-url="datas?.url"
    :config="datas?.config"
    :events_onDocumentReady="onDocumentReady"
  >
  </DocumentEditor> -->
  <div class="text-xl pt-5 text-red-600 text-center">
    {{ errTxt }}
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
// import { getDocumentConfig } from '/src/service/docuemnt'
// import { DocumentEditor } from '@onlyoffice/document-editor-vue'
import { onMounted, ref } from 'vue'

// const router = useRouter()
// const { query, redirectedFrom } = router.currentRoute.value
// let queryMap = new Map(Object.entries(query))
const errTxt = ref('')

const datas = ref()
getDocumentConfig({
  file_id: getUrlSearch('file_id'),
  mode: getUrlSearch('mode')
}).then(({ error, statusCode, data }) => {
  if (error.value) {
    errTxt.value = statusCode.value + ':' + data.value.msg
  } else {
    datas.value = data.value
  }
})

const onDocumentReady = () => {
  console.log('Document is loaded')
}

function getUrlSearch(name) {
  // 未传参，返回空
  if (!name) return null
  // 查询参数：先通过search取值，如果取不到就通过hash来取
  var after = window.location.search
  after = after.substr(1) || window.location.hash.split('?')[1]
  // 地址栏URL没有查询参数，返回空
  if (!after) return null
  // 如果查询参数中没有"name"，返回空
  if (after.indexOf(name) === -1) return null

  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  // 当地址栏参数存在中文时，需要解码，不然会乱码
  var r = decodeURI(after).match(reg)
  // 如果url中"name"没有值，返回空
  if (!r) return null

  return r[2]
}
</script>

<style scoped></style>
