import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import path from 'path'
const resolve = (dir: string) => path.join(__dirname, dir)

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			/*
			 * We recommend to not use aliases in the lib's source,
			 * because they will leak into the generated d.ts files and then
			 * break the lib's types in the consuming app.
			 */
			'@lib': resolve('src')
		},
		extensions: ['.js', '.json', '.vue', '.ts']
	},
	build: {
		lib: {
			name: 'vivid',
			entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
			formats: ['es', 'cjs', 'iife'],
			fileName: (format) => {
				switch (format) {
					case 'es':
						return 'index.mjs'
					case 'cjs':
						return 'index.cjs'
					case 'iife':
						return 'index.js'
					default:
						return 'index.js'
				}
			},
		},
		minify: true,
		rollupOptions: {
			external: [
				'vue',
				'naive-ui',
				'animate.css',
				'katex',
				'lowlight',
				'remixicon/fonts/remixicon.css',
			],
			output: {
				banner: `
/**
 *  Copyright ${new Date(Date.now()).getFullYear()} codecode.run zhufeng 
**/
`,
				exports: 'named',
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
})
