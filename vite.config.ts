import { createLibConfig } from '@nextcloud/vite-config'

export default createLibConfig({
	index: './lib/index.ts',
}, {
	DTSPluginOptions: {
		rollupTypes: true,
	},
	libraryFormats: ['cjs', 'es'],
})
