<template>
  <codemirror
    ref="mycode"
    v-model="curCode"
    :options="cmOptions"
    class="code-area"
    :style="{ height: '100%' }"
  >
  </codemirror>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// import { api } from '@/service/service.js'
// import Message from '@/components/common/Message/Message.js'
import { Codemirror } from 'vue-codemirror'

const props = defineProps({
  value: {
    type: String
  }
})

const curCode = ref('')
const cmOptions = ref({
  value: '', //编辑器的起始值。可以是字符串，也可以是文档对象。
  mode: 'text/x-hive', //第一个将模式名称映射到它们的构造函数，第二个将MIME类型映射到模式规范。
  theme: 'liquibyte', //编辑器样式的主题
  indentWithTabs: true, //在缩进时，是否tabSize 应该用N个制表符替换前N *个空格。默认值为false。
  smartIndent: true, //是否使用模式提供的上下文相关缩进（或者只是缩进与之前的行相同）。默认为true。
  lineNumbers: true, //是否在编辑器左侧显示行号。
  matchBrackets: true, //括号匹配
  autofocus: true, //可用于使CodeMirror将焦点集中在初始化上
  extraKeys: { 'Ctrl-Space': 'autocomplete' }, //按键配置
  hintOptions: {
    tables: {
      users: ['name', 'score', 'birthDate'],
      countries: ['name', 'population', 'size']
    }
  }
})

onMounted(() => {
  curCode.value = props.value
})
</script>

<style scoped lang="less">
.code-area {
  display: block !important;
  margin: 0 auto;
  font-size: 12px;
  height: calc(100vh - 57px) !important;
  .cm-editor {
    height: 100%;
  }
}
.wcontent {
  height: calc(100vh - 75px) !important;
}
</style>
