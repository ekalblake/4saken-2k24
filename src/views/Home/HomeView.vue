<template>
	<v-container fluid>
		<HomeGuess v-if="!userInfo" />
		<HomeLogged v-else />
	</v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";

/* import homeLogged from './Home/homeLogged.vue' */
import PlayersItemModel from "@/models/Player/PlayerItemModel";

import { useUserStore } from "@/store/userStore";
import HomeGuess from "./HomeGuess.vue";
import HomeLogged from "./homeLogged.vue";

const userStore = useUserStore();

const userInfo = computed<PlayersItemModel | null>(
	() => userStore.userInfo as PlayersItemModel | null,
);
</script>
<style scoped></style>
