import type { UserConfig } from 'vite'
import config from './vite.config'

export default async (env) => {
	const cfg = await config(env) as UserConfig
	// rollup-node-externals is not compatible with vitest
	cfg.plugins = cfg.plugins!.filter((plugin) => plugin && 'name' in plugin && plugin.name !== 'node-externals')

	cfg.test = {
		environment: 'happy-dom',
		coverage: {
			include: ['lib/**'],
			reporter: ['lcov', 'text'],
		},
	}
	delete cfg.define
	return cfg
}
