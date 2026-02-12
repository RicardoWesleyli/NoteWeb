import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  // 如果部署到 https://<USERNAME>.github.io/<REPO>/，请将 base 设置为 '/<REPO>/'
  // 例如：base: '/NoteWeb/',
  base: '/NoteWeb/', 
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
})
