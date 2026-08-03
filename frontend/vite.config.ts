import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Geliştirmede Laravel API'si ayrı portta çalışır; proxy sayesinde
  // tarayıcı aynı origin'i görür ve CORS'a takılmayız.
  const apiTarget = env.VITE_DEV_API_PROXY || 'http://localhost:8000'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      // Three.js sahnesi ayrı chunk'ta kalsın diye uyarı eşiğini yükseltiyoruz.
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          /**
           * Yalnızca ağır ve isteğe bağlı kütüphaneleri ayrı chunk'a alıyoruz.
           * React'i elle bölmüyoruz: paylaşılan bağımlılıklar yüzünden
           * chunk'lar arası döngü oluşuyor ve Rollup'ın kendi bölmesi
           * bu senaryoda daha iyi sonuç veriyor.
           */
          manualChunks(id) {
            if (!id.includes('node_modules')) return
            if (id.includes('@react-three') || /[\\/]three[\\/]/.test(id)) return 'three'
            if (id.includes('gsap')) return 'gsap'
            if (
              id.includes('framer-motion') ||
              id.includes('motion-dom') ||
              id.includes('motion-utils')
            ) {
              return 'motion'
            }
            if (id.includes('@radix-ui')) return 'radix'
            return undefined
          },
        },
      },
    },
  }
})
