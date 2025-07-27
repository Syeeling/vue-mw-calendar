import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssPxToViewport from 'postcss-px-to-viewport-8-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    lib: {
      entry: ['src/packages/index.js', 'src/packages/Calendar/style/mobile/mobile.js'],
      name: 'VueMwCalendar',
      formats: ['es'],
      fileName: format => `vue-mw-calendar.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core']
    },
    cssCodeSplit: true
  },
  css: {
    postcss: {
      plugins: [
        postcssPxToViewport({
          unitToConvert: 'px',
          viewportWidth: 750,
          unitPrecision: 6,
          propList: ['*'],
          viewportUnit: 'vw',
          fontViewportUnit: 'vw',
          selectorBlackList: [],
          minPixelValue: 1,
          mediaQuery: false,
          replace: true,
          landscape: false,
          exclude: [/\/src\/packages\/Calendar\/style\/index\.scss/]
        })
      ]
    }
  }
})
