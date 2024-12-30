<template>
	<v-container v-if="userList" class="text-white" fluid>
		<v-row>
			<v-col cols="12">
				<h1 class="text-h4 text-center font-weight-bold text-uppercase pa-5">Leaderboard</h1>
			</v-col>
			<v-col cols="12">
				<v-card class="bgc_cards">
					<v-data-table
						class="bg-transparent text-white"
						:headers="headers"
						:items="userList.getPlayers()"
						:loading="loading"
						:items-per-page="15"
						:mobile="null"
						mobile-breakpoint="lg"
						:search="search"
					>
						<template v-slot:top>
							<v-card-item>
								<v-card-title>
									<v-text-field
										color="white"
										v-model="search"
										append-icon="mdi-magnify"
										:label="t('search_player')"
										outlined
										dark
										hide-details
									>
									</v-text-field>
								</v-card-title>
							</v-card-item>
						</template>
						<template v-slot:item.personaname="{ item }">
							<a :href="item.getProfileURL()" target="_blank">
								<v-avatar tile size="35">
									<img alt="Profile Pic" :src="item.getAvatarFull()" />
								</v-avatar>
							</a>
							<span class="px-3" :style="item.getColorChatStyle()">
								{{ item.getPersonaName() }}
							</span>
						</template>
						<template v-slot:item.report="{ item }">
							<v-btn class="bg-primary" @click="reportPlayer()"> Reportar </v-btn>
						</template>
						<template v-slot:item.Rating="{ item }">
							{{ item.getRating() }}
						</template>
						<template v-slot:item.ranked="{ item }">
							<v-avatar size="35" tile>
								<v-img :src="item.getMmrImage()" />
							</v-avatar>
						</template>
						<template v-slot:item.created_at="{ item }">
							{{ item.getCreatedAt() }}
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { playerService } from "@/services/Player/PlayerService";
import PlayersModel from "@/models/Player/PlayersModel";

import { useI18n } from "vue-i18n";
import useEmitter from "@/composables/useEmitter";

const { t } = useI18n();

const userList = ref<PlayersModel | null>(null);

const loading = ref<boolean>(true);

const emitter = useEmitter();

const headers = ref([
	{
		title: "",
		sortable: false,
		key: "number",
	},
	{ title: "Perfil", value: "personaname", sortable: true },
	{ title: "Steam ID", value: "SteamID64" },
	{ title: "Report", value: "report" },
	{ title: "MMR", value: "Rating", sortable: true },
	{ title: "Rank", value: "ranked" },
	{ title: "Registrado", value: "created_at", sortable: true },
]);

const search = ref<string>("");

const getOnlineUsers = async () => {
	playerService
		.getUsers()
		.then((response) => {
			userList.value = new PlayersModel(response.data.data);
			loading.value = false;
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const reportPlayer = () => {
	/* window.open(`http://4saken.sourcebans.site.nfoservers.com/index.php?p=submit&steamid=${steamid}&nickname=${username}`)
	window.open("https://discord.com/channels/893610141243555901/1001626482726142002"); */
};

onMounted(() => {
	getOnlineUsers();
});
</script>
<style scoped></style>
