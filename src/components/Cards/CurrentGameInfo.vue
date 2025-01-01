<template>
	<v-card
		v-if="currentGame"
		class="bgc_cards text-white rounded-lg h-75 py-3"
		min-height="725"
		max-height="725"
		height="auto"
		:style="userInfo?.getBoxShadow()"
	>
		<v-row>
			<v-col cols="12" class="d-flex justify-center">
				<v-img :src="`src/assets/match/${currentGame.getMmrImage()}`" height="125" width="auto" />
			</v-col>
		</v-row>
		<v-row class="mt-n6 mx-3">
			<v-col md="12" lg="6" cols="12">
				<v-card-text class="bgc_cards border-lg rounded-lg font-weight-bold text-subtitle-2">
					<div
						v-for="(teamA, i) of currentGame.getTeamA().getPlayers()"
						class="d-flex pa-3 justify-space-between align-center"
						:key="i"
					>
						<span> {{ teamA.getPersonaName() }} </span>
						<v-avatar :style="teamA.getBoxShadow()" size="25">
							<v-img :src="teamA.getAvatarFull()" />
						</v-avatar>
					</div>
				</v-card-text>
			</v-col>
			<v-col md="12" lg="6" cols="12">
				<v-card-text class="bgc_cards border-lg rounded-lg font-weight-bold text-subtitle-2">
					<div
						v-for="(teamB, i) of currentGame.getTeamB().getPlayers()"
						class="d-flex pa-3 justify-space-between align-center"
						:key="i"
					>
						<span> {{ teamB.getPersonaName() }}</span>
						<v-avatar :style="teamB.getBoxShadow()" size="25">
							<v-img :src="teamB.getAvatarFull()" />
						</v-avatar>
					</div>
				</v-card-text>
			</v-col>
			<v-col cols="12">
				<v-card-text>
					<v-img
						class="mx-auto"
						:src="`/assets/maps/${currentGame.getMapImage()}`"
						width="auto"
						height="100"
					/>
				</v-card-text>
				<v-card-text class="text-center justify-center">
					<v-chip class="ma-1" variant="elevated" color="success">
						{{ currentGame.getMapName() }}
					</v-chip>
					<v-chip class="ma-1" variant="elevated" color="success">
						{{ currentGame.getRegion() }}
					</v-chip>
					<v-chip class="ma-1" variant="elevated" color="success">
						{{ currentGame.getMatchId() }}
					</v-chip>
					<v-chip class="ma-1" variant="elevated" color="success" @click="copyIp(currentGame.getIp())">
						{{ currentGame.getIp() }}
					</v-chip>
					<v-chip variant="elevated" color="success"> Promedio: {{ currentGame.getMmrAverage() }} </v-chip>
				</v-card-text>
				<v-card-text class="d-flex justify-center">
					<v-btn @click="joinGame(currentGame.getIp())" color="success">
						{{ t("join") }}
					</v-btn>
				</v-card-text>
			</v-col>
		</v-row>
	</v-card>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";

import QueueGamesItemModel from "@/models/Queues/QueueGamesItemModel";

import { useUserStore } from "@/store/userStore";
import { computed } from "vue";

const { t } = useI18n();

const userStore = useUserStore();

defineProps<{
	currentGame: QueueGamesItemModel | null;
}>();

const userInfo = computed(() => userStore.userInfo);

const copyIp = (ip: string) => {
	navigator.clipboard.writeText(ip);
};

const joinGame = (ip: string) => {
	const steamUrl = "steam://connect/" + ip;
	window.location.href = steamUrl;
};
</script>

<style scoped></style>
