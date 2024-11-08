import vue from "@vitejs/plugin-vue";
import fonts from "vite-plugin-fonts";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  plugins: [
    vue(),
    fonts({
      google: {
        families: [
          { name: "Nunito Sans", weights: "wght@0,400;0,700;1,400;1,700" },
        ],
      },
    }),
  ],
  build: { minify: "esbuild", emptyOutDir: true },
};
