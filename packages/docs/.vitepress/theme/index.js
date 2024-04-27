// import plugin from 'portal-vue'
import DefaultTheme from 'vitepress/theme'
import { VividEditor } from '@codecoderun/vivid'
import "remixicon/fonts/remixicon.css"
import "@codecoderun/vivid/dist/style.css"
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(VividEditor)
  },
}
