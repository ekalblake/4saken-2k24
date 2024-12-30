<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<h1 class="text-white text-h4 text-center font-weight-bold text-uppercase pa-5">
					{{ t("faq_1") }}
				</h1>
			</v-col>
			<v-col md="12" cols="12"> </v-col>
		</v-row>
	</v-container>
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
