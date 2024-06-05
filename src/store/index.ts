// store/index.ts
import type { App } from 'vue'; 
import { createPinia } from 'pinia'; 
import piniaPersist from 'pinia-plugin-persistedstate'; // 引入持久化插件

const store = createPinia(); 
store.use(piniaPersist); // 使用 piniaPersist

export function useStore(app: App<Element>) {
  app.use(store);
}
export default store;
