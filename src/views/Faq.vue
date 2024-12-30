<template>
	<v-row>
		<v-col cols="12">
			<h1 class="text-white text-h4 text-center font-weight-bold text-uppercase pa-5">
				{{ t("faq_1") }}
			</h1>
		</v-col>
		<v-col md="12" cols="12">
			<!-- <v-expansion-panels class="mx-5" flat hover tile>
				<v-expansion-panel class="singular">
					<v-expansion-panel-title class="title justify-center" hide-actions>
						{{ t("faq_2") }}
					</v-expansion-panel-title>
					<v-expansion-panel-text v-html="t('faq_3')" eager class="px-6 text-center">
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels> -->
		</v-col>
	</v-row>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
<style>
.singular {
	background: rgba(17, 17, 23, 0.5) !important;
	color: white !important;
	outline: none;
	border-color: #ef4242;
	box-shadow: 0 0 10px #c20606;
}

.faq_title {
	color: #9d1010;
}
</style>
