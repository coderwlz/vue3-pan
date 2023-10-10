import 'normalize.css'
import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueCodeMirror from 'vue-codemirror'
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueCodeMirror)
app.use(VueViewer as any)
app.mount('#app')
