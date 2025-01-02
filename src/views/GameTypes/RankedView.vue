<template>
	<v-container class="h-100" fluid>
		<v-row>
			<v-col cols="12">
				<OnlineInformation />
			</v-col>
		</v-row>
		<v-row>
			<v-col md="5" lg="4" sm="12" cols="12">
				<QueueBox :game-type="getPathGame" />
			</v-col>
			<v-col md="7" lg="4" sm="12" cols="12" class="align-self-center">
				<template v-if="!gameUser">
					<UserNavigation :game-type="getPathGame" />
				</template>
				<template v-else>
					<CurrentGameInfo :current-game="gameUser" />
				</template>
			</v-col>
			<v-col md="5" lg="4" sm="12" cols="12">
				<CurrentGamesList :room="getPathGame" />
			</v-col>
		</v-row>
	</v-container>
	<v-menu eager :close-on-back="false" :close-on-content-click="false" location="right">
		<template v-slot:activator="{ props }">
			<v-fab
				color="secondary"
				v-bind="props"
				icon="mdi-chat"
				location="bottom end"
				size="64"
				absolute
				app
				appear
			></v-fab>
		</template>
		<ChatBox :game-type="getPathGame" />
	</v-menu>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

import OnlineInformation from "@/components/Cards/OnlineInformation.vue";
import QueueBox from "@/components/Cards/QueueBox.vue";
import ChatBox from "@/components/Cards/Chat/ChatBox.vue";
import UserNavigation from "@/components/Cards/UserNavigation.vue";
import CurrentGameInfo from "@/components/Cards/CurrentGameInfo.vue";
import CurrentGamesList from "@/components/Cards/CurrentGamesList.vue";

import useSocket from "@/composables/useSocket";

import QueueGamesItemModel from "@/models/Queues/QueueGamesItemModel";
import { playerService } from "@/services/Player/PlayerService";
import useEmitter from "@/composables/useEmitter";

const emitter = useEmitter();

const socketInstance = useSocket();

const getPathGame = ref<number>(2);

const gameUser = ref<any>(null);

const socketEvents = () => {
	socketInstance.emit("room:join-room-emit", getPathGame.value);

	socketInstance.on("queue:match-start", (event: IQueueGame) => {
		gameUser.value = new QueueGamesItemModel(event);
	});
};

const verifyGame = () => {
	playerService
		.getCurrentGame()
		.then((response) => {
			if (response.data.data) {
				gameUser.value = new QueueGamesItemModel(response.data.data);
			}
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

onMounted(() => {
	socketEvents();
	verifyGame();
});

onUnmounted(() => {
	socketInstance.emit("room:leave-room", getPathGame.value);
});
</script>
<style scoped></style>
