<template>
	<v-row>
		<v-col>
			<v-card v-if="!queueList" class="queue_progressbar_center queue_card" color="transparent">
				<v-progress-circular indeterminate color="primary" />
			</v-card>
			<v-card
				v-else
				class="queue_card bgc_cards"
				min-height="620"
				max-height="620"
				height="auto"
				color="transparent"
			>
				<v-tabs v-model="tab" align-tabs="center" class="text-fs-primary">
					<v-tab :value="1"> En linea </v-tab>
					<v-tab :value="2"> En Cola </v-tab>
				</v-tabs>
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
		</v-col>
	</v-row>
	<MatchFoundDialog
		v-model:dialog="dialogVisible"
		@update:model-value="updateDialog"
		@update:player-ready="playerReady"
		@update:player-drop="dropQueue"
	/>
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
import useEmitter from "@/composables/useEmitter";

const userStore = useUserStore();

const emitter = useEmitter();

const socketInstance = useSocket();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const props = defineProps<{
	gameType: number;
}>();

const dialogVisible = ref<boolean>(false);

const tab = ref<boolean>();

const queueList = ref<QueueModel | null>(null);

const dropQueue = async () => {
	queuesService
		.dropQueue(userInfo.value?.getUserId(), props.gameType)
		.then(() => {
			emitter.emit("queue:verify-queue");
		})
		.catch((err) => {
			console.log(err);
		});
};

const getRankedQueue = () => {
	queuesService
		.getRankedList(props.gameType)
		.then((response: IQueue[]) => {
			queueList.value = new QueueModel(response);

			const findUser = queueList.value
				.getQueue()
				.find((user: QueueItemModel) => user.getUserId() == userInfo.value?.getUserId());

			if (findUser) {
				emitter.emit("queue:verify-queue");
			}
		})
		.catch(() => {
			console.log("ERROR AL LISTAR LA COLA");
		});
};

const updateDialog = (status: boolean) => {
	dialogVisible.value = status;
};

const playerReady = () => {
	socketInstance.emit("queue:set-ready");
};

onMounted(() => {
	getRankedQueue();

	socketInstance.on("queue:player-joined", () => {
		getRankedQueue();
	});

	socketInstance.on("queue:player-dropped", () => {
		getRankedQueue();
	});

	socketInstance.on("queue:prompt-ready", () => {
		dialogVisible.value = true;
	});
});

onUnmounted(() => {
	/* clearTimeout(intervalQueue.value); */
});
</script>
<style scoped>
.queue_card {
	overflow: auto;
	overflow-x: hidden;
}

.queue_progressbar_center {
	min-height: 450px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
