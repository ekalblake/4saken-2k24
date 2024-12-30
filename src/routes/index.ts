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
	{
		path: "/faq",
		name: WebPages.FAQ,
		component: () => import("@/views/Faq.vue"),
	},
	/* {
		path: "/leaderboard",
		name: WebPages.LEADERBOARD,
		component: () => import("@/views/Leaderboard.vue"),
	},
	{
		path: "/about",
		name: WebPages.ABOUT,
		component: () => import("@/views/About.vue"),
	},
	{
		path: "/partners",
		name: WebPages.PARTNERS,
		component: () => import("@/views/Partners.vue"),
	}, */
	/* {
		 path: "/prime",
		 name: WebPages.PREMIUM,
		 component: () => import("@/views/Premium.vue"),
	}, */
	{
		path: "/configuration",
		name: WebPages.CONFIGURATION,
		component: () => import("@/views/Configuration.vue"),
		meta: {
			requiresAuth: true,
		},
	},
	/* {
		path: "/servers",
		name: WebPages.SERVERS,
		component: () => import("@/views/Servers.vue"),
	}, */
	/* {
		path: "/admin",
		name: WebPages.ADMIN,
		component: () => import("@/views/Admin/AdminView.vue"),
		meta: {
			requiresAuth: true,
			is_admin: true,
		},
		children: [
			{
				path: "/admin/players",
				name: WebPages.ADMIN_PLAYERS,
				component: () => import("@/views/Admin/components/playerList.vue"),
			},
			{
				path: "/admin/servers",
				name: WebPages.ADMIN_SERVERS,
				component: () => import("@/views/Admin/components/serverList.vue"),
			},
			{
				path: "/admin/maps",
				name: WebPages.ADMIN_MAPS,
				component: () => import("@/views/Admin/components/mapList.vue"),
			},
		],
	}, */
	{
		path: "/:catchAll(.*)",
		name: WebPages.NOTFOUND,
		component: () => import("@/views/ErrorView/NotFound.vue"),
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
