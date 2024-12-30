<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<OnlineInfo />
			</v-col>
			<v-col md="12" sm="12" cols="12" class="h-100">
				<v-card class="bgc_cards text-center h-100" min-height="575px" min-width="300px">
					<v-card-text>
						<h6 class="text-white text-h4 text-center font-weight-bold text-uppercase">
							{{ t("home_title") }}
						</h6>
					</v-card-text>
					<div class="d-flex justify-center">
						<v-img width="auto" height="300" src="src/assets/types/TYPE_RANKED.png"> </v-img>
					</div>
					<v-card-text class="text-white text-h6 font-weight-bold">
						{{ t("subtitle_2") }}
					</v-card-text>
					<v-card-text class="text-fs-primary font-weight-bold">
						<v-chip color="warning">
							<template v-slot:prepend>
								<v-icon>mdi-alert</v-icon>
							</template>
							<span class="px-2"> {{ t("span_2") }}</span>
						</v-chip>
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
		</v-row>
	</v-container>
</template>

<script lang="ts" setup>
import OnlineInfo from "@/components/Cards/OnlineInformation.vue";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
<style scoped></style>
