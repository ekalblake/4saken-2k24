<template>
	<input type="file" style="display: none" ref="inputFileRef" @change="selectedFile" />
	<div class="d-flex w-100 align-self-center bg-grey-lighten-2 rounded-lg" v-if="!startAudio">
		<v-menu location="left" :close-on-content-click="false">
			<template v-slot:activator="{ props }">
				<v-btn class="align-self-center rounded-lg" size="small" icon v-bind="props">
					<v-icon>mdi-emoticon-happy-outline</v-icon>
				</v-btn>
			</template>
			<EmojiPicker @select="handleEmojiSelected" />
		</v-menu>
		<v-text-field
			v-model="messageField"
			variant="plain"
			density="compact"
			hide-details
			counter="50"
			@keypress.enter.exact.prevent="sendMessageKey"
			@paste="handlePaste"
		>
		</v-text-field>
		<v-btn
			size="small"
			@click="inputFileRef?.click()"
			class="text-primary-gip bg-transparent"
			elevation="0"
			variant="text"
			:ripple="false"
			icon
		>
			<v-icon>mdi-paperclip</v-icon>
		</v-btn>
	</div>
	<div class="d-flex w-100 align-self-center mx-2" v-if="startAudio">
		<v-icon v-if="!existsAudio" :class="isPause ? '' : ''" class="text-error"> mdi-record </v-icon>
		<p class="px-2" v-if="!existsAudio">
			{{ isPause ? "Pausado" : "Grabando..." }}
		</p>
		<audio
			v-show="existsAudio"
			controls
			:src="audio.url"
			:type="audio.mime"
			style="width: 100%; height: 40px"
		></audio>
	</div>
	<v-btn class="rounded-lg" v-if="messageField.length > 0" size="small" @click="sendMessageKey" icon>
		<v-icon>mdi-send</v-icon>
	</v-btn>
	<v-btn
		class="rounded-lg"
		size="small"
		v-if="messageField.length == 0 && !startAudio"
		@click="initRecorderAudio"
		icon
	>
		<v-icon>mdi-microphone</v-icon>
	</v-btn>
	<v-btn v-if="startAudio && !existsAudio" class="rounded-lg" size="small" @click="pauseRecorderAudio" icon>
		<v-icon>{{ isPause ? "mdi-play-circle-outline" : " mdi-pause-circle-outline" }}</v-icon>
	</v-btn>
	<v-btn v-if="startAudio && !existsAudio" class="rounded-lg" size="small" @click="stopRecorderAudio" icon>
		<v-icon>mdi-stop-circle-outline</v-icon>
	</v-btn>
	<v-btn v-if="existsAudio" class="rounded-lg" size="small" @click="dropRecorderAudio" icon>
		<v-icon>mdi-delete-outline</v-icon>
	</v-btn>
	<v-btn v-if="startAudio && existsAudio" class="rounded-lg" size="small" @click="sendRecorder" icon>
		<v-icon>mdi-send</v-icon>
	</v-btn>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";

import EmojiPicker from "vue3-emoji-picker";

import { useUserStore } from "@/store/userStore";

import useSocket from "@/composables/useSocket";
import useEmitter from "@/composables/useEmitter";

import { chatService } from "@/services/Chat/ChatService";

import PlayerItemModel from "@/models/Player/PlayerItemModel";

import { validFileChoosed } from "@/utils/helpers";

const userStore = useUserStore();

const socketInstance = useSocket();

const emitter = useEmitter();

const props = defineProps<{
	gameType: number;
}>();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const textAreaRef = ref<HTMLInputElement | null>(null);

const inputFileRef = ref<HTMLInputElement | null>(null);

const inputTextHasContent = ref<boolean>(false);

const startAudio = ref<boolean>(false);

const mediaRecorder = ref<MediaRecorder | null>(null);

const isPause = ref<boolean>(false);

const isRecording = ref(false);

const isPaused = ref(false);

const existsAudio = ref<boolean>(false);

const messageField = ref<string>("");

const audio = reactive<any>({
	blob: null,
	mime: "",
	url: "",
});

const handleEmojiSelected = (selection: any) => {
	if (!textAreaRef.value) return;
	textAreaRef.value.innerHTML += selection.i;
	inputTextHasContent.value = true;
};

const handlePaste = (event: any) => {
	event.preventDefault();

	const clipboardData = (event.originalEvent || event).clipboardData;
	const pastedItems = clipboardData.items;
	let isText = pastedItems[0].kind === "string";

	if (!isText) {
		let files = clipboardData.files;
		for (let index = 0; index < files.length; index++) {
			const response = validFileChoosed(files[index]);
			if (!response.success) {
				emitter.emit("alert", response);
				return;
			} else {
				emitter.emit("messenger:add-file", files[index]);
			}
		}
	} else {
		let pastedText = clipboardData.getData("text/plain");
		pastedText = pastedText.replace(/\n/g, "<br>");

		document.execCommand("insertHTML", false, pastedText);
	}
};

const sendMessageKey = () => {
	if (messageField.value.length > 50) {
		return emitter.emit("alert", {
			message: "El mensaje es demasiado largo. Debe ser menor o igual a 50 caracteres.",
			success: false,
		});
	}

	const message: IMessageObj = {
		message_type: "TEXT",
		message_data: {
			text: messageField.value,
		},
	};

	chatService
		.sendMessage(props.gameType, message)
		.then((response) => {
			socketInstance.emit("chat:handle-send-message", {
				message: response.data.data,
				room: props.gameType,
			});
			messageField.value = "";
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const pauseRecorderAudio = () => {
	isPause.value = !isPause.value;
	if (mediaRecorder.value && isRecording.value) {
		if (isPaused.value) {
			mediaRecorder.value.resume();
		} else {
			mediaRecorder.value.pause();
		}
		isPaused.value = !isPaused.value;
	}
};

const stopRecorderAudio = () => {
	mediaRecorder.value?.stop();
	existsAudio.value = true;
};

const initRecorderAudio = async () => {
	startAudio.value = true;
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRecorder.value = new MediaRecorder(stream);

		mediaRecorder.value.ondataavailable = onDataAvailable;

		window.streamAudio = stream;

		mediaRecorder.value.start();
		isRecording.value = true;
		isPaused.value = false;
	} catch (error) {
		console.error("Error initializing audio recorder:", error);
	}
};

const onDataAvailable = (event: BlobEvent) => {
	const mimeType = event.data.type;
	const audioBlob = new Blob([event.data], { type: mimeType });
	const audioUrl = URL.createObjectURL(audioBlob);

	audio.blob = audioBlob;
	audio.mime = mimeType;
	audio.url = audioUrl;

	//@ts-ignore
	window.streamAudio.getTracks().forEach((track) => track.stop());
};

const dropRecorderAudio = () => {
	startAudio.value = false;
	existsAudio.value = false;
	isPause.value = false;
	mediaRecorder.value = null;

	audio.blob = null;
	audio.mime = "";
	audio.url = "";

	//@ts-ignore
	window.streamAudio.getTracks().forEach((track) => track.stop());
};

const sendRecorder = async () => {
	try {
		let formData = new FormData();

		formData.append("files", audio.blob, `audio_${Date.now()}.ogg`);

		const response = await chatService.uploadFiles(formData);

		const message: IMessageObj = {
			message_type: "AUDIO",
			message_data: {
				destination: response.data.data.destination,
				filename: response.data.data.filename,
				mimetype: response.data.data.mimetype,
				original_name: response.data.data.original_name,
			},
		};

		const sendAudio = await chatService.sendMessage(props.gameType, message);

		socketInstance.emit("chat:handle-send-message", {
			room: props.gameType,
			message: sendAudio.data.data,
		});

		dropRecorderAudio();
	} catch (err: any) {
		emitter.emit("alert", err.response.data);
	}
};

const selectedFile = async (event: any) => {
	const response = validFileChoosed(event.target.files[0]);
	if (!response.success) {
		emitter.emit("alert", response);
		return;
	}

	const file = event.target.files[0];

	const type = typeFile(file);

	try {
		let formData = new FormData();

		formData.append("files", file);

		const response = await chatService.uploadFiles(formData);
		const message: IMessageObj = {
			message_type: type,
			message_data: {
				destination: response.data.data.destination,
				filename: response.data.data.filename,
				mimetype: response.data.data.mimetype,
				original_name: response.data.data.original_name,
			},
		};

		const sendFile = await chatService.sendMessage(props.gameType, message);

		socketInstance.emit("chat:handle-send-message", {
			room: props.gameType,
			message: sendFile.data.data,
		});
	} catch (err: any) {
		console.log(err);
		emitter.emit("alert", err.response.data);
	}
};

const typeFile = (file: File) => {
	if (file.type.includes("image")) {
		return "IMAGE";
	}
	if (file.type.includes("application") || file.type.includes("text")) {
		return "FILE";
	}
	if (file.type.includes("audio")) {
		return "AUDIO";
	}
	if (file.type.includes("video")) {
		return "VIDEO";
	}

	return "TEXT";
};

onMounted(() => {
	if (mediaRecorder.value) {
		mediaRecorder.value.stop();
		mediaRecorder.value.onstop = null;
		mediaRecorder.value.ondataavailable = null;
		//@ts-ignore
		window?.streamAudio.getTracks().forEach((track) => track.stop());
	}
});
</script>
<style scoped>
.message-input {
	flex-grow: 1;
	border: none;
	background-color: transparent;
	border: none;
	outline: none;
	align-self: center;
	max-height: 125px;
	overflow-y: auto;
}
</style>
