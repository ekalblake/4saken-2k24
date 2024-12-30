<template>
	<v-row>
		<v-col cols="12">
			<v-form ref="formServer" v-model="validForm" lazy-validation>
				<v-row>
					<v-col class="hidden-sm-and-down" cols="12" md="4"> </v-col>
					<v-col cols="12" md="2">
						<v-text-field
							v-model="serverObj.ip"
							:rules="[(v) => !!v || 'IP es requerido']"
							label="IP"
							required
						></v-text-field>
					</v-col>
					<v-col cols="12" md="2">
						<v-text-field
							dark
							v-model="serverObj.port"
							:counter="5"
							:rules="[
								(v) => !!v || 'PORT es requerido',
								(v) => (v && v.length <= 5) || 'Menor de 6 digitos.',
							]"
							label="PORT"
							required
						></v-text-field>
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field
							dark
							v-model="serverObj.extra"
							:counter="25"
							:rules="[
								(v) => !!v || 'Nombre es requerido',
								(v) => (v && v.length <= 25) || 'Menor de 25 digitos.',
							]"
							label="Server name"
							required
						></v-text-field>
					</v-col>
					<v-col cols="12" md="1">
						<v-btn block color="success" :disabled="!validForm" @click.stop.prevent="addServer">
							<v-icon dark> mdi-plus </v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</v-col>
	</v-row>
	<div v-if="!serverList"></div>
	<v-row v-else>
		<v-col cols="12" md="3" sm="4" v-for="(server, i) of serverList.getServerArray()" :key="i">
			<v-card class="bg-fs-primary pa-2 text-white">
				<v-row>
					<v-col cols="12" md="9">
						<p>{{ server.getExtra() }}</p>
						<p>{{ server.getIp() }}:{{ server.getPort() }}</p>
					</v-col>
					<v-col cols="3" md="3">
						<v-btn
							size="small"
							icon="mdi-minus"
							color="indigo"
							@click.once="removeServer(server.getServerId(), i)"
						>
						</v-btn>
					</v-col>
				</v-row>
			</v-card>
		</v-col>
	</v-row>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { adminService } from "@/services/Admin/AdminService";
import ServerModel from "@/models/Admin/ServerModel";

import useEmitter from "@/composables/useEmitter";

const emitter = useEmitter();

const formServer = ref<HTMLFormElement | null>(null);

const serverList = ref<ServerModel | null>(null);

const validForm = ref<boolean>(false);

const serverObj = reactive<{ ip: string; extra: string; port: number }>({
	ip: "",
	extra: "",
	port: 0,
});

const getServerList = async () => {
	adminService.getServerList().then((response) => {
		serverList.value = new ServerModel(response.data.data);
		console.log(serverList.value);
	});
};

const addServer = async () => {
	if (!formServer.value) return;

	const { valid } = await formServer.value.validate();

	if (valid) {
		await adminService
			.newServer(serverObj)
			.then((response) => {
				serverList.value?.addServer(response.data.data);
				emitter.emit("alert", response.data);
			})
			.catch((err) => {
				emitter.emit("alert", err.data.data);
			});
	}
	formServer.value.reset();
};

const removeServer = async (serverId: number, index: number) => {
	adminService
		.deleteServer(serverId)
		.then((response) => {
			serverList.value?.removeServer(index);
			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.data.data);
		});
};

onMounted(() => {
	getServerList();
});
</script>

<style scoped></style>
