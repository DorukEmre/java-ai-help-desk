import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from "fs"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      https: isDev
        ? {
          key: fs.readFileSync("./localhost-key.pem"),
          cert: fs.readFileSync("./localhost-cert.pem"),
        }
        : undefined,
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['color-functions', 'global-builtin', 'import', 'if-function']
        },
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
})
