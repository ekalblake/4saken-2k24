<template>
	<HomeGuess v-if="!userInfo" />
	<HomeLogged v-else />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import HomeGuess from "@/views/Home/HomeGuess.vue";
import HomeLogged from "@/views/Home/homeLogged.vue";

import PlayersItemModel from "@/models/Player/PlayerItemModel";

import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();

const userInfo = computed<PlayersItemModel | null>(() => userStore.userInfo as PlayersItemModel | null);
</script>
<style scoped></style>
