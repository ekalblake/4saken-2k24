<template>
	<v-footer app class="text-white bgc_cards">
		<v-row justify="center">
			<v-col class="text-center my-4" cols="12">
				{{ new Date().getFullYear() }} —
				<strong>
					{{ t("developed_by") }}
					<a href="https://steamcommunity.com/id/blakewasd/" target="_blank">blake</a>
				</strong>
			</v-col>
		</v-row>
	</v-footer>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped></style>
