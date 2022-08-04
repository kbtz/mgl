import { defineConfig } from 'vite'

export default defineConfig({
	publicDir: 'pub',
	server: {
		host: 'mgl',
		port: 80
	},
	resolve: {
		alias: [
			{ find: /^\+(.*)$/, replacement: '/res/$1' },
			{ find: 'lib', replacement: '/lib/index.ts' },
		]
	}
})