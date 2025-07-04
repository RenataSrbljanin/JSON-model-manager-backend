/// <reference types="vitest" />
import { defineConfig } from "vitest/config"; // ✅ NOT from 'vite'
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
  },
});
