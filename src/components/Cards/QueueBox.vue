<template>
	<v-container class="bgc_cards">
		<v-card class="bgc_cards ma-3">
			<v-img :src="`src/assets/ranked_medals/${userInfo?.getMmrImage()}`" height="80" />
			<v-card-actions class="justify-center">
				<v-btn
					class="bg-fs-primary rounded-lg text-white text-decoration-none pa-4 align-content-center"
					:loading="isDisabled"
					v-if="!isJoined"
					@click="joinQueue"
				>
					<small> Entrar a la cola </small>
				</v-btn>
				<v-btn
					v-else
					class="bg-fs-secondary rounded-lg text-white text-decoration-none pa-4 align-content-center"
					@click="dropQueue"
				>
					<small> Salir de la cola</small>
				</v-btn>
			</v-card-actions>
			<v-card-actions v-if="isJoined">
				Esperando que entren 5 jugadores, o 20min45segundos para empezar
			</v-card-actions>
		</v-card>
		<v-card v-if="!queueList" class="queue_progressbar_center queue_card" color="transparent">
			<v-progress-circular indeterminate color="primary" />
		</v-card>
		<v-card v-else class="queue_card mx-2" color="transparent">
			<v-card-text>
				<v-tabs v-model="tab" align-tabs="center" class="text-fs-primary">
					<v-tab :value="1"> En linea </v-tab>
					<v-tab :value="2"> En Cola </v-tab>
				</v-tabs>
			</v-card-text>
			<v-tabs-window v-model="tab">
				<v-tabs-window-item :value="1">
					<OnlinePlayerList />
				</v-tabs-window-item>
				<v-tabs-window-item :value="2">
					<v-list class="bg-transparent ma-1 overflow-auto">
						<v-list-item
							lines="one"
							v-for="(queue, i) of queueList.getQueue()"
							class="my-2 bgc-opacity-30 rounded-lg"
							:key="i"
						>
							<template v-slot:prepend>
								<v-tooltip location="top">
									<template v-slot:activator="{ props }">
										<span v-bind="props">
											<v-img
												width="33px"
												height="25px"
												:alt="queue.getMmrName()"
												:src="`src/assets/ranked_medals/${queue.getMmrImage()}`"
											/>
										</span>
									</template>
									<small>
										{{ queue.getRating() }} -
										{{ queue.getMmrName() }}
									</small>
								</v-tooltip>
							</template>
							<template v-slot:default>
								<v-card-text
									class="text-center"
									:style="{
										color: queue.getColorChat(),
										textShadow: '0 0 10px ' + queue.getGlowColor(),
										fontWeight: 'bold',
									}"
								>
									{{ queue.getPersonaName().substring(0, 19) }}
								</v-card-text>
							</template>
							<template v-slot:append>
								<v-avatar
									tile
									size="25"
									:style="'box-shadow: 0px 0px 5px' + queue.getColorChat() + ';'"
								>
									<img alt="Profile Pic" height="30" :src="queue.getAvatarFull()" />
								</v-avatar>
							</template>
						</v-list-item>
					</v-list>
				</v-tabs-window-item>
			</v-tabs-window>
		</v-card>
	</v-container>
	<MatchFoundDialog v-model:dialog="dialogVisible" :time="readyTime" @update:model-value="updateDialog" />
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import QueueModel from "@/models/Queues/QueueModel";

import { useUserStore } from "@/store/userStore";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

import useSocket from "@/composables/useSocket";
import { queuesService } from "@/services/Queues/QueuesService";
import QueueItemModel from "@/models/Queues/QueueItemModel";

import OnlinePlayerList from "@/components/Cards/OnlinePlayerList.vue";
import MatchFoundDialog from "@/components/Dialogs/MatchFoundDialog.vue";

const userStore = useUserStore();

const socketInstance = useSocket();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const props = defineProps<{
	gameType: number;
}>();

const dialogVisible = ref<boolean>(false);

const readyTime = ref<number>(30);

const tab = ref<boolean>();

const queueList = ref<QueueModel | null>(null);

const isJoined = ref<boolean>(false);

const isDisabled = ref<boolean>(false);

const joinQueue = async () => {
	queuesService.joinQueue(props.gameType);
};

const dropQueue = async () => {
	queuesService.dropQueue(userInfo.value?.getUserId(), props.gameType);
};

const getRankedQueue = async () => {
	const { data } = await queuesService.getQueueStatus(props.gameType);

	queueList.value = new QueueModel(data);

	const findUser = queueList.value
		.getQueue()
		.find((user: QueueItemModel) => user.getUserId() == userInfo.value?.getUserId());

	if (findUser) {
		isJoined.value = true;
	}
};

const updateDialog = (status: boolean) => {
	dialogVisible.value = status;
};

onMounted(() => {
	getRankedQueue();

	socketInstance.on("queue:player-joined", () => {
		getRankedQueue();
	});

	socketInstance.on("queue:player-dropped", () => {
		getRankedQueue();
	});

	socketInstance.on("queue:player-joined-user", () => {
		isJoined.value = true;
	});
	socketInstance.on("queue:player-dropped-user", () => {
		isJoined.value = false;
	});

	socketInstance.on("queue:set-player-ready", () => {
		dialogVisible.value = true;
	});
});

onUnmounted(() => {
	/* clearTimeout(intervalQueue.value); */

	socketInstance.emit("onunmounted:room", props.gameType);

	queueList.value?.getQueue().forEach(async (q: QueueItemModel) => {
		if (q.getUserId() == userInfo.value?.getUserId()) await dropQueue();
	});
});
</script>
<style scoped>
.queue_card {
	overflow: auto;
	height: 680px;
	overflow-x: hidden;
}

.queue_progressbar_center {
	min-height: 450px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
