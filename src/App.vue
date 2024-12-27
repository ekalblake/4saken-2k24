<template>
	<v-app>
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
import NavigationBar from "@/components/Navigation/NavigationBar.vue";
import FooterCard from "@/components/Cards/FooterCard.vue";
import NotificactionComponent from "@/components/Extras/NotificactionComponent.vue";

import { useRoute } from "vue-router";

import useSocket from "@/composables/useSocket";

const route = useRoute();

const socketInstance = useSocket();
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
