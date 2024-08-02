import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  define: {
    global: {},
  },
  server: {
    port: 8000,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8000",
  },
});
