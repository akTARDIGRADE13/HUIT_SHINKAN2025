import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    base: '/HUIT_SHINKAN2025',
    resolve: {
        alias: {
            '/src/main.tsx': '/src/HUIT_SHINKAN2025/main.tsx',
        },
    },
})
