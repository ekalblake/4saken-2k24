import { createApp } from "vue";

import App from "./App.vue";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import i18n from "./plugins/i18n";
import vuetify from "./plugins/vuetify";
import pinia from "./plugins/pinia";

import router from "./routes/index";

import mitt from "mitt";

const emitter = mitt();

const app = createApp(App);

app.config.globalProperties.emitter = emitter;

app.use(vuetify).use(i18n).use(router).use(pinia).mount("#app");
