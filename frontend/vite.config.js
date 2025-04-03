import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'



export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake", "bumblebee", "synthwave", "retro"], // Add more themes here
  },
});