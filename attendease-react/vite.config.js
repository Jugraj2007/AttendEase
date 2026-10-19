import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  root: projectRoot,
  base: process.env.GITHUB_PAGES === 'true' ? '/AttendEase/' : '/',
  publicDir: path.resolve(projectRoot, 'attendease-react/public'),
  plugins: [react()],
})