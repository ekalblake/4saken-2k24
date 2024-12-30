<template>
	<v-container fluid class="text-white">
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
