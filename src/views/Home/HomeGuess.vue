<template>
	<v-container fluid>
		<v-card class="bgc text-white text-center pa-5">
			<v-row>
				<v-col cols="12" sm="12" md="5" lg="5">
					<h2 class="text-center text-uppercase">
						{{ t("mejora_tu_experiencia") }}
					</h2>
					<v-card-text>
						{{ t("inicia_sesion") }}
					</v-card-text>
					<v-card-text class="d-flex justify-center align-center">
						<v-img
							class="cursor-pointer"
							@click="steamLogin()"
							src="src/assets/sign-in.png"
							max-width="200"
							max-height="200"
							contain
						/>
					</v-card-text>
					<v-card-text class="text-capitalize">
						<v-chip @click="router.push('/about')" class="bg-success">
							{{ t("aprende_mas") }}
						</v-chip>
					</v-card-text>
				</v-col>
				<v-col cols="12" sm="12" md="7" lg="7">
					<v-row no-gutters>
						<v-col md="3" cols="2">
							<v-img height="70" src="src/assets/matchup/matchmaking.png" />
						</v-col>
						<v-col md="9" cols="10" class="text-left">
							<v-card-subtitle class="text-uppercase font-weight-bold">
								{{ t("emparejamiento_justo") }}
							</v-card-subtitle>
							<v-card-text>
								{{ t("emparejamiento_justo2") }}
							</v-card-text>
						</v-col>
					</v-row>
					<v-divider class="pa-2"></v-divider>
					<v-row no-gutters>
						<v-col md="3" cols="2">
							<v-img height="70" src="src/assets/matchup/versus.png" />
						</v-col>
						<v-col md="9" cols="10" class="text-left">
							<v-card-subtitle class="text-uppercase font-weight-bold">
								{{ t("emparejamiento_teams") }}
							</v-card-subtitle>
							<v-card-text>
								{{ t("emparejamiento_teams2") }}
							</v-card-text>
						</v-col>
					</v-row>
					<v-divider class="pa-2"></v-divider>

					<v-row no-gutters>
						<v-col md="3" cols="2">
							<v-img height="70" src="src/assets/matchup/progress.png" />
						</v-col>
						<v-col md="9" cols="10" class="text-left">
							<v-card-subtitle class="text-uppercase font-weight-bold pb-0">
								{{ t("progress_skill") }}
							</v-card-subtitle>
							<v-card-text>
								{{ t("progress_skill2") }}
							</v-card-text>
						</v-col>
					</v-row>
					<v-divider class="pa-2"></v-divider>

					<v-row no-gutters>
						<v-col md="3" cols="2">
							<v-img height="70" src="src/assets/matchup/tournaments.png" />
						</v-col>
						<v-col md="9" cols="10" class="text-left">
							<v-card-subtitle class="text-uppercase font-weight-bold pb-0">
								{{ t("torneos") }}
							</v-card-subtitle>
							<v-card-text>
								{{ t("torneos2") }}
							</v-card-text>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-card>
	</v-container>
</template>
<script lang="ts" setup>
import { API_URL } from "@/constants/constants";

import { useRouter } from "vue-router";

const router = useRouter();

import { useI18n } from "vue-i18n";

const { t } = useI18n();

const steamLogin = () => {
	window.open(API_URL + "/auth/login", "_self");
};
</script>
<style scoped>
.bgc {
	background: rgba(56, 52, 52, 0.3) !important;
	justify-content: center;
	align-items: center;
}
</style>
