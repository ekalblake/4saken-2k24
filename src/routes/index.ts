import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import { WebPages } from "../constants/constants";

import HomeView from "../views/Home/HomeView.vue";
import RankedView from "../views/GameTypes/RankedView.vue";

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
		/* meta: {
			requiresAuth: true,
		}, */
	},
];

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async (to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (localStorage.getItem("steamid") == null) {
			next({ name: WebPages.HOME });
		} else {
			const user: number = JSON.parse(localStorage.getItem("rol") || "");
			if (to.matched.some((record) => record.meta.is_admin)) {
				if (user == 2) {
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
