import { createApp } from 'vue'
import App from './App.vue'
import './styles/common.scss'
import store from './store'
import router from './router' // 导入 router
// main.ts

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store)
app.use(router) // 使用 router
app.mount('#app')
