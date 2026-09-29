import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // relative paths so the site works at username.github.io/daddys-birthday/
  base: "./",
  plugins: [react(), tailwindcss()],
});
