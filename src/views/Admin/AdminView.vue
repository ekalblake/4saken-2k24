<template>
	<v-container fluid>
		<v-card class="bgc_cards py-2 mb-2">
			<v-row>
				<v-col sm="12" md="4" cols="12" v-for="(card, i) of cardInfo" :key="i">
					<v-card
						:style="userInfo?.getBoxShadow()"
						class="bgc_cards d-flex justify-center text-white mx-auto"
						hover
						elevation="16"
						max-width="350"
						@click="sendTo(card.router)"
					>
						<div class="py-4 text-center">
							<v-icon class="mb-3" color="#d9d9d9" :icon="card.icon" size="32"> </v-icon>
							<div class="text-h4 font-weight-bold">{{ card.title }}</div>
						</div>
					</v-card>
				</v-col>
			</v-row>
		</v-card>
		<v-card :style="userInfo?.getBoxShadow()" class="bgc_cards text-white">
			<v-card-text>
				<RouterView />
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts" setup>
import { computed, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { WebPages } from "@/constants/constants";
import { useUserStore } from "@/store/userStore";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

const userStore = useUserStore();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const router = useRouter();

const cardInfo: Ref<Array<{ title: string; router: string; icon: string }>> = ref([
	{ title: "Jugadores", router: WebPages.ADMIN_PLAYERS, icon: "mdi-map" },
	{ title: "Mapas", router: WebPages.ADMIN_MAPS, icon: "mdi-account" },
	{ title: "Servidores", router: WebPages.ADMIN_SERVERS, icon: "mdi-server" },
]);

const sendTo = (view: string) => {
	router.push({
		name: view,
	});
};
</script>

<style scoped></style>
