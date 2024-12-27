<template>
	<v-card :min-height="minHeight" :max-height="maxHeight" class="queue_progressbar_center queue_card bgc_cards">
		<v-progress-circular indeterminate color="primary" />
	</v-card>
</template>
<script lang="ts" setup>
defineProps<{
	minHeight: string;
	maxHeight: string;
}>();
</script>
<style>
.queue_progressbar_center {
	min-height: 450px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
