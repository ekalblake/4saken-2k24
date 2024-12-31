<template>
	<template v-if="currentGames">
		<v-card
			v-if="userInfo"
			class="game_card bgc_cards rounded-lg h-75"
			min-height="725"
			max-height="725"
			height="auto"
			:style="userInfo?.getBoxShadow()"
		>
			<v-card-item>
				<v-card-title class="text-white">
					{{ t("match_history") }}: {{ currentGames.getQueueGames().length }}
				</v-card-title>
			</v-card-item>
			<v-card-text>
				<template v-for="current in currentGames.getQueueGames()">
					<v-card :style="userInfo?.getBoxShadow()" class="bgc_cards mb-3" height="auto">
						<v-row class="py-2">
							<v-col md="4" cols="12">
								<v-card-text
									class="py-2"
									v-for="(currentGame, i) of current.getTeamA().getPlayers()"
									:key="i"
								>
									<div class="d-flex justify-space-between">
										<a :href="currentGame.getProfileURL()">
											<v-avatar :style="currentGame.getBoxShadow()" size="30">
												<v-img
													:alt="currentGame.getPersonaName()"
													:src="currentGame.getAvatarFull()"
												/>
											</v-avatar>
										</a>
										<p
											class="text-subtitle-2 font-weight-black"
											:style="[currentGame.getColorChatStyle()]"
										>
											{{ currentGame.getPersonaName().substring(0, 13) }}
										</p>
									</div>
								</v-card-text>
							</v-col>
							<v-divider vertical class="my-2 text-white"></v-divider>
							<v-col md="4" cols="12">
								<v-card-text
									class="py-2"
									v-for="(currentGame, i) of current.getTeamB().getPlayers()"
									:key="i"
								>
									<div class="d-flex justify-space-between">
										<p
											class="text-subtitle-2 font-weight-black"
											:style="[currentGame.getColorChatStyle()]"
										>
											{{ currentGame.getPersonaName().substring(0, 13) }}
										</p>
										<a :href="currentGame.profileurl">
											<v-avatar :style="currentGame.getBoxShadow()" size="30">
												<v-img
													:alt="currentGame.getPersonaName()"
													:src="currentGame.getAvatarFull()"
												/>
											</v-avatar>
										</a>
									</div>
								</v-card-text>
							</v-col>
							<v-col md="4" cols="12">
								<v-card-text class="pa-0 pl-3 py-1 text-center text-white d-flex flex-column h-100">
									<p class="text-h6 font-weight-bold">{{ current.getMapName() }}</p>
									<v-img
										class="mx-auto"
										width="auto"
										height="50"
										:src="`/assets/new_ranked/${current.getRankImage()}`"
									>
									</v-img>
									<p>{{ current.getGameStarted() }}</p>
								</v-card-text>
							</v-col>
						</v-row>
					</v-card>
				</template>
			</v-card-text>
		</v-card>
	</template>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";

import { useI18n } from "vue-i18n";

import QueueGamesModel from "@/models/Queues/QueueGamesModel";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

import { queuesService } from "@/services/Queues/QueuesService";

import { useUserStore } from "@/store/userStore";
import useEmitter from "@/composables/useEmitter";

const props = defineProps<{
	room: number;
}>();

const { t } = useI18n();

const emitter = useEmitter();

const userStore = useUserStore();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const currentGames = ref<QueueGamesModel | null>(null);

const getCurrentGames = async () => {
	queuesService
		.currentGames(props.room)
		.then((response) => {
			currentGames.value = new QueueGamesModel(response.data.data);
		})
		.catch((err) => {
			emitter.emit(err.response.data);
		});
};

onMounted(() => {
	getCurrentGames();
});
</script>

<style scoped>
.game_card {
	overflow: auto;
	overflow-x: hidden;
}
</style>
