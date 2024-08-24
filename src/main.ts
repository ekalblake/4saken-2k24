import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import i18n from "./plugins/i18n";

import router from "./routes/index";

import mitt from "mitt";

const emitter = mitt();

const vuetify = createVuetify({
	components,
	directives,
	ssr: true,
});

const pinia = createPinia();

const app = createApp(App);

app.config.globalProperties.emitter = emitter;

app.use(vuetify).use(i18n).use(router).use(pinia).mount("#app");
