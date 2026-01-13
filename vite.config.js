import { defineConfig } from 'vite';

export default defineConfig({
  	build: {
    	outDir: 'dist/web'
  	},
  	server: {
    	port: 8888,
    	proxy: {
      		'/api': {
        		target: 'http://localhost:3000', // Your node-main port in dev
        		changeOrigin: true,
      		},
    	},
  	},
});
