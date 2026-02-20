import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "screenshot-mobile.png", "screenshot-desktop.png"],
      manifest: {
        id: "/",
        name: "Tasbeeh - Digital Dhikr Counter",
        short_name: "Tasbeeh",
        description: "A peaceful digital Tasbeeh counter for your daily dhikr practice",
        lang: "en",
        dir: "ltr",
        categories: ["lifestyle", "utilities", "productivity"],
        theme_color: "#f7f5f2",
        background_color: "#f7f5f2",
        display: "standalone",
        display_override: ["standalone", "minimal-ui"],
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        launch_handler: {
          client_mode: "navigate-existing"
        },
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshot-mobile.png",
            sizes: "1024x1024",
            type: "image/jpeg",
            form_factor: "narrow",
            label: "Tasbeeh Counter - Mobile View"
          },
          {
            src: "/screenshot-desktop.png",
            sizes: "1024x1024",
            type: "image/jpeg",
            form_factor: "wide",
            label: "Tasbeeh Counter - Desktop View"
          }
        ],
        shortcuts: [
          {
            name: "Start Tasbih 100",
            short_name: "100",
            description: "Start a 100-count dhikr session",
            url: "/?session=100",
            icons: [{ src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" }]
          },
          {
            name: "Morning Adhkar",
            short_name: "Morning",
            description: "Start your Morning Adhkar routine",
            url: "/?routine=morning",
            icons: [{ src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" }]
          },
          {
            name: "Evening Adhkar",
            short_name: "Evening",
            description: "Start your Evening Adhkar routine",
            url: "/?routine=evening",
            icons: [{ src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" }]
          }
        ],
        protocol_handlers: [
          {
            protocol: "web+tasbeeh",
            url: "/?action=%s"
          }
        ],
        share_target: {
          action: "/",
          method: "GET",
          enctype: "application/x-www-form-urlencoded",
          params: {
            title: "title",
            text: "text",
            url: "url"
          }
        }
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Reverting to default esbuild minification to fix production issue
    outDir: "dist",
    sourcemap: false,
  },
}));
