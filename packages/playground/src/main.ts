import { createApp } from 'vue'
// @ts-ignore
import { VividEditor,useBold } from '@codecoderun/vivid'
// import { VividEditor } from '../../lib/dist/index.mjs'
// import '../../lib/dist/style.css'
import App from './App.vue'
const app = createApp(App)
// @ts-ignore
app.use(VividEditor)
app.mount('#app')
