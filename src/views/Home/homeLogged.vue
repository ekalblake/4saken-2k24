<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<OnlineInfo />
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<h6 class="text-fs-primary text-h4 text-center font-weight-bold text-uppercase">
					{{ t("home_title") }}
				</h6>
			</v-col>
		</v-row>
		<v-row>
			<!-- <v-col md="6" sm="6" cols="12">
				<v-card
					class="bgc_cards text-center ma-3"
					min-height="575px"
					min-width="300px"
				>
					<v-img
						width="auto"
						height="300"
						src="src/assets/types/TYPE_PUG.png"
					>
					</v-img>
					<v-card-text class="text-white">
						{{ t("subtitle_1") }}
					</v-card-text>
					<v-card-text class="text-fs-primary font-weight-bold">
						{{ t("span_1") }}
					</v-card-text>
					<v-card-actions class="justify-center">
						<RouterLink
							disabled
							class="home_btn_disabled"
							to="game/solo"
						>
							{{ t("main_button_disabled") }}
						</RouterLink>
					</v-card-actions>
				</v-card>
			</v-col> -->
			<v-col md="12" sm="12" cols="12">
				<v-card class="bgc_cards text-center" min-height="575px" min-width="300px">
					<div class="d-flex justify-center">
						<v-img width="auto" height="300" src="src/assets/types/TYPE_RANKED.png"> </v-img>
					</div>
					<v-card-text class="text-white">
						{{ t("subtitle_2") }}
					</v-card-text>
					<v-card-text class="text-fs-primary font-weight-bold">
						{{ t("span_2") }}
					</v-card-text>
					<v-card-actions class="justify-center">
						<RouterLink
							class="text-white bg-fs-primary rounded-lg pa-3 text-decoration-none"
							to="game/ranked"
						>
							{{ t("main_button_play_2") }}
						</RouterLink>
					</v-card-actions>
				</v-card>
			</v-col>
			<!-- <v-col md="4" sm="6" cols="12">
				<v-card
					class="bgc_cards text-center ma-3"
					min-height="575px"
					min-width="300px"
				>
					<v-img
						width="auto"
						cover
						height="300"
						src="src/assets/types/TYPE_SCRIM.png"
					>
					</v-img>
					<v-card-text class="text-white">
						{{ t("subtitle_3") }}
					</v-card-text>
					<v-card-text class="text-fs-primary font-weight-bold">
						{{ t("span_3") }}
					</v-card-text>
					<v-card-actions class="justify-center">
						<RouterLink
							disabled
							class="home_btn_disabled"
							to="game/solo"
						>
							{{ t("main_button_disabled") }}
						</RouterLink>
					</v-card-actions>
				</v-card>
			</v-col> -->
		</v-row>
	</v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import OnlineInfo from "@/components/Cards/OnlineInformation.vue";
import PlayerItemModel from "@/models/Player/PlayerItemModel";
import socketInstance from "@/services/socket";

import useSocket from "@/composables/useSocket";

import { useI18n } from "vue-i18n";

import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const { t } = useI18n();

const socket = useSocket();

const socketInit = () => {
	socket.connect();
	socketInstance.auth = { userInfo };
};

onMounted(() => {
	socketInit();
});
</script>
<style scoped>
/* .home_btn_disabled {
	border-radius: 10px;
	background-color: #340808 !important;
	color: #fff !important;
	align-content: center !important;
	padding: 5px;
	text-decoration: none;
	padding: 10px !important;
} */
</style>
