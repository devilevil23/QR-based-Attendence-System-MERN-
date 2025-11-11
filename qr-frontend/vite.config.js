import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Set the port to 3000 for your frontend
    proxy: {
      '/api': {
        target: 'http://localhost:5000/',  // Backend server address (assuming your API is running here)
        changeOrigin: true, // This makes the request look like it's coming from the backend
        secure: false, // Set to true if you're using HTTPS in production
        rewrite: (path) => path.replace(/^\/api/, '') // This will strip /api prefix from the URL
      },
    },
  },
});
