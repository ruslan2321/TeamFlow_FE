import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("recharts") || id.includes("d3-")) {
            return "charts";
          }

          if (
            id.includes("@chakra-ui") ||
            id.includes("@emotion") ||
            id.includes("framer-motion")
          ) {
            return "chakra";
          }

          if (id.includes("react-router") || id.includes("@remix-run")) {
            return "router";
          }

          if (
            id.includes("@reduxjs/toolkit") ||
            id.includes("react-redux") ||
            id.includes("redux")
          ) {
            return "redux";
          }

          if (id.includes("react-dom") || id.includes("/react/")) {
            return "react";
          }

          return "vendor";
        },
      },
    },
  },
});
