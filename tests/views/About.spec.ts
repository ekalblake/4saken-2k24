import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import About from "@/views/About.vue"; // ajusta la ruta de acuerdo a tu estructura
import { createI18n } from "vue-i18n";
import Vuetify from "@/plugins/vuetify";
import { createApp } from "vue";

import languageEn from "@/labels/languageEN";
import languageEs from "@/labels/languageES";

const i18n = createI18n({
	locale: "en",
	messages: {
		en: languageEn,
		es: languageEs,
	},
});

const app = createApp(About);
app.use(Vuetify);
app.use(i18n);

describe("About", () => {
	it("renders correct content from i18n", async () => {
		const wrapper = mount(About, {
			global: {
				plugins: [i18n, Vuetify],
			},
		});

		expect(wrapper.text()).toContain("it’s an online platform which goal is to gather");
		expect(wrapper.text()).toContain("players to organize competitive matchmaking.");
		expect(wrapper.text()).toContain("so everyone will be able to play stress-free casual");
		expect(wrapper.text()).toContain("While this early development phase is on board");

		const discordLink = wrapper.find("a");
		expect(discordLink.attributes("href")).toBe("https://discord.gg/MhKvK9r75r");
		expect(discordLink.text()).toBe("Discord");
	});
});
