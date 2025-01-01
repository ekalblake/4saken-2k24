<template>
	<v-app>
		<MatchFound />
		<NavigationBar />
		<v-main class="content h-100">
			<router-view :key="route.fullPath" />
		</v-main>
		<FooterCard />
		<!-- <early-access 
          :dialog="dialog" 
          @verify-dialog="closeDialog"
          /> -->
	</v-app>
	<NotificactionComponent />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import NavigationBar from "@/components/Navigation/NavigationBar.vue";
import FooterCard from "@/components/Cards/FooterCard.vue";
import NotificactionComponent from "@/components/Extras/NotificactionComponent.vue";
import MatchFound from "@/components/Cards/Items/MatchFound.vue";

import { useRoute } from "vue-router";

const route = useRoute();

const notificationPermissions = () => {
	document.addEventListener("DOMContentLoaded", () => {
		const notificationPermissionRequested = localStorage.getItem("notificationPermissionRequested");

		if (!notificationPermissionRequested) {
			if ("Notification" in window) {
				Notification.requestPermission().then((permission) => {
					localStorage.setItem("notificationPermissionRequested", "true");

					if (permission === "granted") {
						console.log("Permiso de notificaciones concedido.");
					} else {
						console.log("Permiso de notificaciones denegado.");
					}
				});
			} else {
				console.log("El navegador no soporta notificaciones.");
			}
		}
	});
};

onMounted(() => {
	notificationPermissions();
});
</script>
<style>
@import "./style.css";

html,
body {
	overflow: auto;
	scroll-behavior: smooth;
}

::-webkit-scrollbar {
	width: 5px;
	display: none;
}

::-webkit-scrollbar-track {
	background: #1f1f54;
	box-shadow: 0 0 10px #1f1f54;
	border-radius: 50px;
}

.content {
	background-color: #1f1f54;
}
</style>
