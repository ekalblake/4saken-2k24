import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import { WebPages } from "../constants/constants";

import HomeView from "../views/Home/HomeView.vue";
import RankedView from "../views/GameTypes/RankedView.vue";
import { useUserStore } from "@/store/userStore";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: WebPages.HOME,
		component: HomeView,
	},
	{
		path: "/game/ranked",
		name: WebPages.RANKED,
		component: RankedView,
		meta: {
			requiresAuth: true,
		},
	},
];

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async (to, from, next) => {
	const userStore = useUserStore();

	const isAuthenticated = await userStore.checkAuthentication();

	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!isAuthenticated) {
			next({ name: WebPages.HOME });
		} else {
			const verifyAdmin = userStore.getUserInfo?.getRol();

			if (to.matched.some((record) => record.meta.is_admin)) {
				if (verifyAdmin == 2) {
					next();
				} else {
					next({ name: WebPages.HOME });
				}
			} else {
				next();
			}
		}
	} else {
		next();
	}
});

export default router;
