import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: false,
          enabledCollections: ['x', 'mdi']
        })
      ],
      directoryAsNamespace: true
    }),
    Icons({
      autoInstall: true,
      defaultClass: 'material-icons',
      customCollections: {
        x: FileSystemIconLoader(
          path.join(__dirname, './src/assets/icons')
        ) as any
      },
      iconCustomizer: function (collection, icon, props) {
        if (collection === 'x') {
          if (props.class) {
            props.class += ' x-icon'
          } else {
            props.class = 'x-icon'
          }
        }
        return
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/w': {
        target: 'http://59.110.7.8:3000',
        // target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/w/, '')
      }
    }
  }
})
