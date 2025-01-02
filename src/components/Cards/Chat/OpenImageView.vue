<template>
	<v-dialog v-model="dialogModel" max-width="900px" height="auto" scrollable>
		<v-card width="auto" min-height="500px">
			<template v-if="image.fileType == 'VIDEO'">
				<!-- <video class="video-cover" controls poster>
                    <source :src="fileSrc" />
                </video> -->
			</template>
			<template v-else-if="image.fileType == 'IMAGE'">
				<v-img :src="image.fileSrc" alt="Imagen" />
			</template>
		</v-card>
	</v-dialog>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, reactive } from "vue";

import useEmitter from "@/composables/useEmitter";

const emitter = useEmitter();

const image = reactive<any>({
	fileType: "image",
	fileSrc: "",
});

const dialogModel = ref<boolean>(false);

/* watch(dialogModel, (newValue) => {
	if (!newValue) {
		image.fileSrc = "";
		image.fileType = "";
	}
}); */

onMounted(() => {
	emitter.on("open-view-detail", (dataInfo: any) => {
		dialogModel.value = true;
		image.fileType = dataInfo.type;
		image.fileSrc = dataInfo.src;
	});
});
</script>
<style scoped>
.image-preview-file {
	max-width: 100%;
	max-height: 100%;
	overflow: auto;
	text-align: center;
}

.image-cover {
	max-width: 1000px;
	max-height: 700px;
	object-fit: contain;
	border-radius: 7.5px;
}

.video-cover {
	max-width: 1280px;
	max-height: 700px;
	object-fit: contain;
	border-radius: 7.5px;
}
</style>
