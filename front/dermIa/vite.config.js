import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // écoute sur toutes les interfaces
    port: 5173, // même port que ton docker-compose
    watch: {
      usePolling: true, // active le polling
      interval: 100, // vérifie toutes les 100 ms
    },
  },
});
