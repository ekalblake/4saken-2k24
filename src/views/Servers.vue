<template>
	<v-container fluid class="text-white">
		<v-row>
			<v-col cols="12">
				<h1 class="text-h4 text-center font-weight-bold text-uppercase pa-5">
					{{ t("server_title") }}
				</h1>
			</v-col>
		</v-row>
		<Suspense>
			<ServerList />
			<template #fallback>
				<Loading set-min-height="80vh"> Cargando lista de Servidores </Loading>
			</template>
		</Suspense>
	</v-container>
</template>

<script lang="ts" setup>
import Loading from "@/views/ErrorView/Loading.vue";
import ServerList from "@/views/Component/ServerList.vue";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped>
.bgc1 {
	background: rgba(56, 52, 52, 0.3) !important;
	border-color: #ef4242;
	box-shadow: 0 0 10px #c20606;
}

.btn_join {
	height: 20px !important;
	margin: 5px;
	font-size: 10px;
	background-color: #c20606 !important;
	color: #fff !important;
	text-transform: capitalize;
}

.server_title {
	color: #a70303;
}
</style>
