import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = env.PORT ? Number(env.PORT) : undefined

  if (port !== undefined && (!Number.isInteger(port) || port < 1 || port > 65535)) {
    throw new Error('PORT must be an integer between 1 and 65535')
  }

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), svgr()],
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },
    server: {
      port,
    },
    preview: {
      port,
    },
  }
})
