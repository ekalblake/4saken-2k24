import { defineConfig } from "vite";

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

export default defineConfig({
	base: "./",
	publicDir: "public",

	plugins: [
		vue({
			template: { transformAssetUrls },
		}),
		vuetify(),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
