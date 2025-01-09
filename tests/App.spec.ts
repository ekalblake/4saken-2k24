import { mount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import App from "@/App.vue"; // ajusta la ruta de acuerdo a tu estructura
import { createI18n } from "vue-i18n";
import Vuetify from "@/plugins/vuetify";
import pinia from "@/plugins/pinia";
import { createApp } from "vue";
import languageEn from "@/labels/languageEN";
import languageEs from "@/labels/languageES";
import MatchFound from "@/components/Cards/Items/MatchFound.vue";
import NavigationBar from "@/components/Navigation/NavigationBar.vue";
import FooterCard from "@/components/Cards/FooterCard.vue";
import NotificactionComponent from "@/components/Extras/NotificactionComponent.vue";
import OpenImageView from "@/components/Cards/Chat/OpenImageView.vue";
import ResizeObserver from "resize-observer-polyfill";
import { mockRouter } from "./mocks/router";

const i18n = createI18n({
	locale: "en",
	legacy: false,
	messages: {
		en: languageEn,
		es: languageEs,
	},
});

const app = createApp(App);
app.use(Vuetify);
app.use(i18n);

global.ResizeObserver = ResizeObserver;

vi.mock("@/composables/useEmitter", () => ({
	default: () => ({
		on: vi.fn(),
		emit: vi.fn(),
	}),
}));

// Mock de localStorage
const localStorageMock = (function () {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string) => store[key],
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

//@ts-ignore
globalThis.localStorage = localStorageMock;

describe("App", () => {
	let wrapper: VueWrapper;

	beforeEach(() => {
		localStorage.clear();

		globalThis.Notification = {
			requestPermission: vi.fn().mockResolvedValue("granted"),
		} as any;

		wrapper = mount(App, {
			global: {
				plugins: [Vuetify, pinia, i18n, mockRouter],
				components: {
					NavigationBar,
					FooterCard,
					NotificactionComponent,
					MatchFound,
					OpenImageView,
				},
			},
		});
	});

	it("Should render component", () => {
		expect(wrapper.exists()).toBe(true);
	});

	it("Should contain Components: NavigationBar, FooterCard y NotificactionComponent", () => {
		expect(wrapper.findComponent(NavigationBar).exists()).toBe(true);
		expect(wrapper.findComponent(FooterCard).exists()).toBe(true);
		expect(wrapper.findComponent(NotificactionComponent).exists()).toBe(true);
	});
});
