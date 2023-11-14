<template>
  <iframe class="view-body" :src="src"></iframe>
  <div class="text-xl pt-5 text-red-600 text-center">
    {{ errTxt }}
  </div>
</template>

<script setup>
// import { useRouter } from 'vue-router'
import { ref, toRefs } from 'vue'
import { officeView, officeDel } from '@/service/modules/file'

const props = defineProps({
  file_id: {
    type: String,
    default: ''
  }
})
const { file_id } = toRefs(props)
console.log(file_id, 'file_id')

const errTxt = ref('')

const src = ref('')

const init = async () => {
  const res = await officeView(file_id.value)
  console.log('res', res)
  if (res.data?.url) {
    src.value = res.data.url
  }
  setTimeout(() => {
    officeDel(file_id.value)
  }, 2000)
}

init()

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

<style scoped>
.view-body {
  width: 100%;
  height: 100%;
}
</style>
