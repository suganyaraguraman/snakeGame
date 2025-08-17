import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  server: {
    port: 3000, // Change to a different port if needed
  },
  base: "/snakeGame",
  plugins: [react()],
});
