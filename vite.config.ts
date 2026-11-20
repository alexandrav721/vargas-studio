import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { host: "127.0.0.1", port: 5177 },
  preview: { host: "127.0.0.1", port: 4177 },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        restitch: fileURLToPath(new URL("./restitch.html", import.meta.url)),
      },
    },
  },
});
