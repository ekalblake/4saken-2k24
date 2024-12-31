<template>
	<LoadingComponent v-if="isLoading" min-height="620" max-height="620" />
	<v-card
		v-else
		:style="[userInfo?.getBoxShadow()]"
		class="queue_card bgc_cards rounded-lg h-75"
		min-height="725"
		max-height="725"
		height="auto"
	>
		<template v-if="userInfo">
			<v-tabs v-model="tab" align-tabs="center" class="text-white bgc_cards" :color="userInfo.getColorChat()">
				<v-tab :value="1"> En linea </v-tab>
				<v-tab :value="2"> En Cola </v-tab>
			</v-tabs>
			<v-tabs-window v-model="tab" class="bgc_cards">
				<v-tabs-window-item :value="1">
					<OnlinePlayerList />
				</v-tabs-window-item>
				<v-tabs-window-item :value="2">
					<v-list v-if="queueList" class="bg-transparent ma-1 overflow-auto" min-height="650px">
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
												width="25"
												height="25"
												:alt="queue.getMmrName()"
												:src="queue.getMmrImage()"
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
								<v-card-text class="text-center" :style="queue.getColorChatStyle()">
									{{ queue.getPersonaName().substring(0, 19) }}
								</v-card-text>
							</template>
							<template v-slot:append>
								<v-avatar tile size="25" :style="queue.getBackgroundColor()">
									<img alt="Profile Pic" height="30" :src="queue.getAvatarFull()" />
								</v-avatar>
							</template>
						</v-list-item>
					</v-list>
				</v-tabs-window-item>
			</v-tabs-window>
		</template>
	</v-card>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from "vue";

import OnlinePlayerList from "@/components/Cards/OnlinePlayerList.vue";
import LoadingComponent from "@/components/Extras/LoadingComponent.vue";

import { useUserStore } from "@/store/userStore";

import useSocket from "@/composables/useSocket";
import useEmitter from "@/composables/useEmitter";

import QueueModel from "@/models/Queues/QueueModel";
import PlayerItemModel from "@/models/Player/PlayerItemModel";
import QueueItemModel from "@/models/Queues/QueueItemModel";

import { queuesService } from "@/services/Queues/QueuesService";

const userStore = useUserStore();

const emitter = useEmitter();

const socketInstance = useSocket();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const props = defineProps<{
	gameType: number;
}>();

const dialogVisible = ref<boolean>(false);

const tab = ref<number>(1);

const queueList = ref<QueueModel | null>(null);

const isLoading = ref<boolean>(false);

const getRankedQueue = () => {
	isLoading.value = true;
	queuesService
		.getRankedList(props.gameType)
		.then((response) => {
			queueList.value = new QueueModel(response.data.data);

			const findUser = queueList.value
				.getQueue()
				.find((user: QueueItemModel) => user.getUserId() == userInfo.value?.getUserId());

			if (findUser) {
				emitter.emit("queue:verify-queue");
			}

			isLoading.value = false;
		})
		.catch(() => {
			isLoading.value = false;
		});
};

onMounted(() => {
	getRankedQueue();

	socketInstance.on("queue:player-joined", (userInfo: IQueue) => {
		if (!queueList.value) return;
		queueList.value.pushQueue(userInfo);
	});

	socketInstance.on("queue:player-dropped", (userid: number) => {
		if (!queueList.value) return;

		queueList.value.filterQueue(userid);
	});

	socketInstance.on("queue:prompt-ready", () => {
		dialogVisible.value = true;
	});

	socketInstance.on("queue:player-dropped-single", () => {
		tab.value = 1;
	});
});

onUnmounted(() => {});
</script>
<style scoped>
.queue_card {
	overflow: auto;
	overflow-x: hidden;
}
</style>
