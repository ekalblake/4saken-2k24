<template>
	<v-col cols="12" class="loading-center bg-fs-primary bgc-opacity-30" :style="{ 'min-height': setMinHeight }">
		<v-img class="loading-image" src="@/assets/logos/LOGOCONNECT@112.png" width="100" />
		<h4 class="text-white">
			<slot></slot>
		</h4>
	</v-col>
</template>
<script setup lang="ts">
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

.loading-image {
	animation: flip-in 2s ease-in-out infinite;
}

@keyframes flip-in {
	0% {
		transform: rotateY(0deg);
	}
	50% {
		transform: rotateY(90deg);
	}
	100% {
		transform: rotateY(0deg);
	}
}
</style>
