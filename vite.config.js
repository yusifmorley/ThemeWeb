import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'


export default defineConfig({
  server: {
    port: 5173, // 设置自定义端口号
    host:"127.0.0.1"
  },
  plugins: [
      vue(),
      viteCompression({
      verbose:true, //是否在控制台显示
      disable:false, //是否禁用
      threshold:10240,//单位 b
      algorithm:"gzip", //压缩算法
      ext:'.gz'
    })

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
