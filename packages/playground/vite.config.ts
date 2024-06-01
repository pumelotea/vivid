import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path' // 第一部分!!!!!!!!!!!!

const resolve = (dir: string) => path.join(__dirname, dir) // 第二部分!!!!!!!!!!!!
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			// we alias to the lib's source files in dev
			// so we don't need to rebuild the lib over and over again
			'@codecoderun/vivid':
				process.env.NODE_ENV === 'production'
					? '@codecoderun/vivid'
					: '@codecoderun/vivid/src/index.ts',
			'@': resolve('src'),
			'@lib': resolve('../lib/src')
		},
		extensions: ['.js', '.json', '.vue', '.ts'],
		dedupe: ['vue'],
	},
	build: {
		// we don't minify so we can look at the bundle ouput. Change if you wanna deploy the playground
		minify: false,
		rollupOptions: {
			// Comment in to move vue out of the bundle - easier to look at the app's bundle content that way.
			// external: ['vue'],
		},
	},
	optimizeDeps: {
		exclude: ['@codecoderun/vivid'],
	},
})
