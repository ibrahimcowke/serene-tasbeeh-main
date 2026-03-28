import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    viteCompression(),
    mode === "development" && componentTagger(),
    VitePWA({
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: "module",
      },
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      includeAssets: ["robots.txt", "screenshot-mobile.png", "screenshot-desktop.png"],
      manifest: {
        id: "/",
        name: "tasbeehdikr",
        short_name: "tasbeehdikr",
        description: "A peaceful digital tasbeehdikr counter for your daily dhikr practice",
        lang: "en",
        dir: "ltr",
        categories: ["lifestyle", "utilities", "productivity"],
        theme_color: "#f8fafc",
        background_color: "#f8fafc",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        prefer_related_applications: false,
        related_applications: [
          {
            platform: "play",
            url: "https://play.google.com/store/apps/details?id=app.netlify.tasbeehdikr.twa",
            id: "app.netlify.tasbeehdikr.twa"
          }
        ],
        iarc_rating_id: "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7",
        scope_extensions: [
          { origin: "https://*.tasbeehdikr.com" },
          { origin: "https://*.netlify.app" },
          { origin: "https://*.lovable.app" }
        ],
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
            label: "tasbeehdikr - Mobile View"
          },
          {
            src: "/screenshot-desktop.png",
            sizes: "1024x1024",
            type: "image/jpeg",
            form_factor: "wide",
            label: "tasbeehdikr - Desktop View"
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
        // @ts-ignore - Experimental W3C Widgets API not yet typed in vite-plugin-pwa
        widgets: [
          {
            name: "tasbeehdikr Quick Action",
            description: "Access your Tasbeeh directly from the home screen",
            tag: "tasbeeh",
            template: "widget_template.json",
            data: "widget_data.json",
            type: "application/json",
            auth: false,
            update: 86400,
            icons: [
              {
                src: "/pwa-192x192.png",
                sizes: "192x192",
                type: "image/png"
              }
            ]
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
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-core': ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
          'db': ['@supabase/supabase-js', '@tanstack/react-query'],
          'viz': ['recharts'],
        }
      }
    }
  },
}));
