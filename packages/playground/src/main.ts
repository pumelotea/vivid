import { createApp } from 'vue'
// @ts-ignore
import { VividEditor } from '@codecoderun/vivid'
import App from './App.vue'
const app = createApp(App)
// @ts-ignore
app.use(VividEditor)
app.mount('#app')
