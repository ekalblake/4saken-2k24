/// <reference types="vitest" />

import { defineConfig } from "vite";

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

export default defineConfig({
	test: {
		include: ["tests/**/*.test.ts", "tests/**/*.spec.ts"],
		server: {
			deps: {
				inline: ["vuetify"],
			},
		},
		globals: true,
		environment: "jsdom",

		coverage: {
			provider: "istanbul",
			reporter: ["text", "json", "html"],
		},
		testTransformMode: {
			web: [".vue"],
		},
	},
	base: "./",
	publicDir: "public",

	plugins: [
		vue({
			template: { transformAssetUrls },
		}),
		vuetify({
			autoImport: true,
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	optimizeDeps: {
		include: ["vuetify"],
	},
	server: {
		port: 5173, // Cambia el puerto a uno diferente si 5173 está en uso
	},
});
