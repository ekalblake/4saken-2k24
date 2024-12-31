<template>
	<v-col cols="12" class="loading-center bg-purple-secondary" :style="{ 'min-height': setMinHeight }">
		<v-img class="mx-auto" src="src/assets/logos/LOGOCONNECT@112.png" width="150" />
		<h3 class="text-center">
			<slot></slot>
		</h3>
		<RouterLink to="/">
			<p class="font-weight-bold text-h4 text-decoration-none text-white">Volver</p>
		</RouterLink>
	</v-col>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
	setMinHeight: string;
}>();
</script>
<style scoped>
.loading-center {
	width: 100%;
	display: grid;
	align-content: center;
	justify-items: center;
	gap: 10px;
}
</style>
