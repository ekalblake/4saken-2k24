<template>
	<v-container class="bgc_cards">
		<v-card class="bgc_cards ma-3">
			<v-img
				:src="`src/assets/ranked_medals/${userInfo?.getMmrImage()}`"
				height="80"
			/>
			<v-card-actions class="justify-center">
				<v-btn
					class="bg-fs-primary rounded-lg text-white text-decoration-none pa-4 align-content-center"
					:loading="isDisabled"
					v-if="!joinedQueue"
					@click="$emit('join-queue', region)"
				>
					<small class="text-caption"> Entrar a la cola </small>
				</v-btn>
				<v-btn
					v-else
					class="bg-fs-secondary rounded-lg text-white text-decoration-none pa-4 align-content-center"
					:loading="isDisabled"
					@click="$emit('drop-queue', region)"
				>
					<small class="text-caption"> Salir de la cola</small>
				</v-btn>
			</v-card-actions>
		</v-card>
		<v-card
			v-if="!queueList"
			class="queue_progressbar_center queue_card"
			color="transparent"
		>
			<v-progress-circular indeterminate color="primary" />
		</v-card>
		<v-card v-else class="queue_card mx-2" color="transparent">
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
							<small class="pa-0 ma-0">
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
							size="20"
							:style="
								'box-shadow: 0px 0px 5px' +
								queue.getColorChat() +
								';'
							"
						>
							<img
								alt="Profile Pic"
								:src="queue.getAvatarFull()"
							/>
						</v-avatar>
					</template>
				</v-list-item>
			</v-list>
		</v-card>
	</v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import QueueModel from "@/models/Queues/QueueModel";

import { useUserStore } from "@/store/userStore";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo as PlayerItemModel | null);

const props = defineProps<{
	queueList: QueueModel | null;
	joinedQueue: boolean;
	isDisabled: boolean;
	getRol: number | undefined;
	getIsPremium: number | undefined;
	region: number;
}>();

const emit = defineEmits<{
	(e: "drop-queue", region: number): void;
	(e: "join-queue", region: number): void;
	(e: "drop-admin", userId: number): void;
}>();
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
