<template>
	<v-app>
		<video autoplay muted loop class="video">
			<source src="@/assets/background-video.webm" type="video/mp4" />
		</video>
		<NavigationBar />
		<v-main class="content">
			<router-view :key="route.fullPath" />
		</v-main>
		<!-- <Footer /> -->
		<!-- <early-access 
          :dialog="dialog" 
          @verify-dialog="closeDialog"
          /> -->
	</v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import NavigationBar from "./components/Navigation/NavigationBar.vue";

import { useRoute } from "vue-router";

import { useUserStore } from "@/store/userStore";

const useStore = useUserStore();

const route = useRoute();

onMounted(() => {
	useStore.fetchUserInfo();
});
</script>
<style>
@import "./style.css";

@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@500&display=swap");

* {
	font-family: "Open Sans", sans-serif;
}

html,
body {
	overflow: auto;
	scroll-behavior: smooth;
}

::-webkit-scrollbar {
	width: 5px;
}

::-webkit-scrollbar-track {
	background: #522323;
	box-shadow: 0 0 10px #c20606;
	border-radius: 50px;
}

::-webkit-scrollbar-thumb {
	background: #c2b4b4;
	border-radius: 50px;
}

.video {
	object-fit: cover;
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
}

.content {
	position: relative;
	z-index: 1;
}
</style>
