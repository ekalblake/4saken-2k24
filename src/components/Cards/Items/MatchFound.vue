<template>
	<v-dialog v-model="matchDialog" width="100%" height="100%">
		<v-card class="bgc-opacity-30 text-white" width="auto">
			<v-img class="mx-auto" width="auto" height="150" src="@/assets/types/TYPE_RANKED.png"></v-img>
			<v-card-text class="justify-center">
				<div class="text-h1 font-weight-bold">PARTIDA ENCONTRADA</div>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>
<script lang="ts" setup>
import useSocket from "@/composables/useSocket";
import { onMounted, ref } from "vue";

import { useUserStore } from "@/store/userStore";

const socket = useSocket();

const userStore = useUserStore();

const matchDialog = ref<boolean>(false);

const joinGame = (ip: string) => {
	const steamUrl = "steam://connect/" + ip;
	return steamUrl;
};

onMounted(() => {
	socket.on("queue:match-start", (event: IQueueGame) => {
		matchDialog.value = true;

		const audio = new Audio("/assets/audio/helpful_event_1.wav");

		audio.volume = userStore.audio;

		audio.play();

		document.title = "⚔️ ¡Nueva partida disponible! ⚔️ ";

		if ("Notification" in window) {
			if (Notification.permission === "default") {
				Notification.requestPermission();
			}

			const nameTeamA = event.teamA.map((member) => member.personaname);
			const nameTeamB = event.teamB.map((member) => member.personaname);

			const message = `Equipo 1: ${nameTeamA.join(", ")}\nEquipo 2: ${nameTeamB.join(", ")}`;

			if (Notification.permission === "granted") {
				const notification = new Notification("⚔️ ¡Nueva partida disponible! ⚔️ ", {
					body: message,
				});

				notification.onclick = () => {
					window.focus();
					window.location.href = joinGame(event.ip);
				};
			}
		}
		setTimeout(() => {
			matchDialog.value = false;
			document.title = "Connect";
		}, 10000);
	});
});
</script>
