import { createRouter, createWebHistory } from "vue-router";

export const mockRouter = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "Home",
			component: { template: "<div>Home</div>" },
		},
		{
			path: "/faq",
			name: "FAQ",
			component: { template: "<div>FAQ</div>" },
		},
		{
			path: "/leaderboard",
			name: "LeaderBoard",
			component: { template: "<div>LeaderBoard</div>" },
		},
		{
			path: "/servers",
			name: "Servers",
			component: { template: "<div>Servers</div>" },
		},
		{
			path: "/about",
			name: "About",
			component: { template: "<div>About</div>" },
		},
		{
			path: "/partners",
			name: "Partners",
			component: { template: "<div>Partners</div>" },
		},
		{
			path: "/prime",
			name: "Prime",
			component: { template: "<div>Prime</div>" },
		},
	],
});
