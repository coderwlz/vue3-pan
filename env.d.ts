/// <reference types="vite/client" />

declare module '*.vue' {
  const component: ComponentOptions | ComponentOptions['setup']
  export default component
}

declare module 'crypto-js'

declare module 'v-viewer'
