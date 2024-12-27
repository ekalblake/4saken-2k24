<template>
	<v-snackbar v-model="snackBarModel" :color="snackBar?.getSuccess() ? 'green' : 'red'">
		{{ snackBar?.getMessage() }}

		<template v-slot:actions>
			<v-btn variant="text" @click="snackBarModel = false"> Cerrar </v-btn>
		</template>
	</v-snackbar>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import SnackBarModelV2 from "@/models/Extra/SnackBarModel";

import useEmitter from "@/composables/useEmitter";

const emitter = useEmitter();

const snackBar = ref<SnackBarModelV2 | null>(null);

const snackBarModel = ref<boolean>(false);

const updateId = ref<any>(null);

const snackbarSuccess = (snackBarObject: IApiResponse) => {
	clearTimeout(updateId.value);

	snackBar.value = new SnackBarModelV2(snackBarObject);
	snackBar.value.setSnackbar(snackBarObject);

	snackBarModel.value = true;

	updateId.value = setTimeout(() => {
		snackBarModel.value = false;
		snackBar.value = null;
	}, 7500);
};

onMounted(() => {
	emitter.on("alert", snackbarSuccess);
});
</script>
