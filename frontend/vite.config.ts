<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

>>>>>>> a45a90a1c2f271bad22ca5ab1d2943437ad40604
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
<<<<<<< HEAD
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
})
=======
      '@': path.resolve(__dirname, './src')
    }
  }
});
>>>>>>> a45a90a1c2f271bad22ca5ab1d2943437ad40604
