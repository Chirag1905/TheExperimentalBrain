import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
export default defineConfig({
  base: '/teb/',
  plugins: [react()],
  define: {
    "process.env": JSON.stringify(dotenv.config().parsed),
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    modules: {
      generateScopedName: "[local]__[hash:base64:5]",
    },
  },
});
