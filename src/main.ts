import { createApp } from 'vue'
import App from './App.vue'

import 'src/css/index.scss'
import 'virtual:uno.css'
import 'animate.css'

// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss'

import pinia from './stores'
import router from './router'
import { i18n } from 'boot/i18n'

async function prepareApp() {
  // if (process.env.NODE_ENV !== 'production') {
  //   const { worker } = await import('boot/msw-browser')
  //   return worker.start()
  // }

  return Promise.resolve()
}

const app = createApp(App)

prepareApp().then(() => {
  app.use(pinia).use(router).use(i18n).mount('#app')
})
