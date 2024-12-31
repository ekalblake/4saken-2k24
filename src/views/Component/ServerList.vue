<template>
	<ErrorCaptured v-if="errorFound" set-min-height="60vh">
		{{ errorFound.message }}
	</ErrorCaptured>
	<template v-else>
		<v-row v-if="serverList">
			<v-col cols="12" class="white--text">
				<v-card class="bgc_cards">
					<v-data-table
						class="bg-transparent text-white"
						:headers="headers"
						:items="serverList.getServerInfoArray()"
						:loading="loading"
						:items-per-page="10"
						:mobile="null"
						mobile-breakpoint="lg"
						:search="search"
					>
						<template v-slot:top>
							<v-card-title>
								<v-spacer></v-spacer>
								<v-text-field
									color="white"
									v-model="search"
									append-icon="mdi-magnify"
									:label="t('server_search')"
									outlined
									dark
									hide-details
								>
								</v-text-field>
							</v-card-title>
						</template>
						<template v-slot:item.numplayers="{ item }">
							<h4 class="justify-center text-white">
								{{ item.getNumPlayers() }}/{{ item.getMaxPlayers() }}
								<v-menu v-if="item.getNumPlayers() != 0" right>
									<template v-slot:activator="{ props }">
										<v-btn v-bind="props" size="small" class="bg-fs-primary ml-2">
											<v-icon size="20">mdi-arrow-down-bold</v-icon>
										</v-btn>
									</template>
									<v-list>
										<v-list-item v-for="(player, i) in item.getPlayers()" :key="i">
											<v-list-item-title>{{ player }}</v-list-item-title>
										</v-list-item>
									</v-list>
								</v-menu>
							</h4>
						</template>
						<template v-slot:item.join="{ item }">
							<v-btn size="small" class="bg-fs-primary" @click="joinGame(item.getIp())"> Entrar </v-btn>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>
	</template>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ServerInfoModel from "@/models/Admin/ServerInfoModel";

import { useI18n } from "vue-i18n";
import { playerService } from "@/services/Player/PlayerService";

import ErrorCaptured from "@/views/ErrorView/ErrorCaptured.vue";

const { t } = useI18n();

const serverList = ref<ServerInfoModel | null>(null);

const loading = ref<boolean>(true);

const search = ref<string>("");

const errorFound = ref<IApiResponse | null>(null);

const headers = ref([
	{
		title: "",
		sortable: false,
		value: "number",
	},
	{ title: "Nombre", value: "name", filterable: true },
	{ title: "IP", value: "ip" },
	{ title: "Jugadores", value: "numplayers" },
	{ title: "Mapa", value: "map" },
	{ title: "Entrar", value: "join" },
]);

const joinGame = (ip: string): void => {
	window.open(`steam://connect/${ip}`);
};

try {
	//@ts-ignore
	const response = await playerService.getServerListPublic();
	serverList.value = new ServerInfoModel(response.data.data);
	loading.value = false;
} catch (err: any) {
	errorFound.value = err.response.data;
	loading.value = false;
}
</script>
