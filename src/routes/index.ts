import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import HomeView from "@/views/Home/HomeView.vue";
import RankedView from "@/views/GameTypes/RankedView.vue";
import Leaderboard from "@/views/Leaderboard.vue";
import Faq from "@/views/Faq.vue";
import Servers from "@/views/Servers.vue";

import AdminView from "@/views/Admin/AdminView.vue";
/* import PlayerList from "@/views/Admin/components/PlayerList.vue"; */
import ServerList from "@/views/Admin/components/ServerListView.vue";
/* import MapList from "@/views/Admin/components/MapList.vue"; */

import NotFound from "@/views/ErrorView/NotFound.vue";

import { useUserStore } from "@/store/userStore";

import { WebPages } from "@/constants/constants";

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
		component: Faq,
	},
	{
		path: "/leaderboard",
		name: WebPages.LEADERBOARD,
		component: Leaderboard,
	},
	/* {
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
	{
		path: "/servers",
		name: WebPages.SERVERS,
		component: Servers,
	},
	{
		path: "/admin",
		name: WebPages.ADMIN,
		component: AdminView,
		meta: {
			requiresAuth: true,
			is_admin: true,
		},
		children: [
			/* {
				path: "/admin/players",
				name: WebPages.ADMIN_PLAYERS,
				component: PlayerList,
			}, */
			{
				path: "/admin/servers",
				name: WebPages.ADMIN_SERVERS,
				component: ServerList,
			},
			/* {
				path: "/admin/maps",
				name: WebPages.ADMIN_MAPS,
				component: MapList,
			}, */
		],
	},
	{
		path: "/:catchAll(.*)",
		name: WebPages.NOTFOUND,
		component: NotFound,
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
