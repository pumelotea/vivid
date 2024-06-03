import DefaultTheme from 'vitepress/theme'
import { defineComponent, h, inject } from 'vue'
import { NConfigProvider } from 'naive-ui'
import { setup } from '@css-render/vue3-ssr'
import { useRoute } from 'vitepress'
import './css/index.css'
import { VividEditor } from '@codecoderun/vivid'
import "remixicon/fonts/remixicon.css"
import "@codecoderun/vivid/dist/style.css"
import WrapDemo from "../components/WrapDemo.vue"

const { Layout } = DefaultTheme
const CssRenderStyle = defineComponent({
	setup () {
		const collect = inject('css-render-collect')
		return {
			style: collect()
		}
	},
	render () {
		return h('css-render-style', {
			innerHTML: this.style
		})
	}
})
const VitepressPath = defineComponent({
	setup () {
		const route = useRoute()
		return () => {
			return h('vitepress-path', null, [route.path])
		}
	}
})

const NaiveUIProvider = defineComponent({
	render () {
		return h(
			NConfigProvider,
			{ abstract: true, inlineThemeDisabled: true },
			{
				default: () => [
					h(Layout, null, { default: this.$slots.default?.() }),
					import.meta.env.SSR ? [h(CssRenderStyle), h(VitepressPath)] : null
				]
			}
		)
	}
})


export default {
	extends: DefaultTheme,
	Layout: NaiveUIProvider,
  enhanceApp({ app }) {
		if (import.meta.env.SSR) {
			const { collect } = setup(app)
			app.provide('css-render-collect', collect)
		}
    app.use(VividEditor)
    app.component('demo', WrapDemo)
  },
}

