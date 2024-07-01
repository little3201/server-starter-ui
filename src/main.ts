import { createApp } from "vue"
import App from "./App.vue"

import "~/styles/index.scss"
import 'virtual:uno.css'
import 'animate.css'

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss"

// 引入状态管理
import { setupStore } from '~/stores'
// 路由
import { setupRouter } from '~/router'

import { setupI18n } from '~/composables/i18n'

async function prepareApp() {
  if (
    process.env.NODE_ENV !== 'production'
  ) {
    const { worker } = await import('~/composables/msw-browser')
    return worker.start()
  }

  return Promise.resolve()
}

const app = createApp(App)
setupStore(app)
setupRouter(app)
setupI18n(app)

prepareApp().then(() => {
  app.mount('#app')
})
