<template>
	<v-dialog :model-value="dialog" @update:model-value="updateDialog" persistent max-width="50%">
		<v-card class="bgc-opacity-30 text-white text-center">
			<v-card-item>
				<v-card-title>
					<p>{{ t("match_found") }}</p>
				</v-card-title>
				<v-card-subtitle>
					{{ time }}
				</v-card-subtitle>
			</v-card-item>
			<v-card-actions class="justify-center">
				<v-btn class="bg-fs-primary" @click="setReady">
					{{ t("accept") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
	dialog: boolean;
}>();

const emit = defineEmits<{
	(e: "update:model-value", value: boolean): void;
	(e: "update:player-ready"): void;
}>();

const updateDialog = (value: boolean) => {
	emit("update:model-value", value);
};

const { t } = useI18n();

const time = ref<number>(30);

const timerId = ref<any>(null);

const startTimeout = () => {
	timerId.value = setInterval(() => {
		if (time.value == 1) {
			time.value = 30;
			emit("update:model-value", false);
			clearTimeout(timerId.value);
		} else {
			time.value--;
		}
	}, 1000);
};

const setReady = () => {
	emit("update:model-value", false);
	clearTimeout(timerId.value);
	time.value = 30;

	emit("update:player-ready");
};

watch(
	() => props.dialog,
	(newVal) => {
		if (newVal) {
			startTimeout();
		}
	},
);

onUnmounted(() => {
	clearTimeout(timerId.value);
});
</script>
