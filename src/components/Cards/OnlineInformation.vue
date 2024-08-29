<template>
	<v-row>
		<v-col cols="12" sm="12" md="12" lg="12">
			<v-card class="bg-transparent text-white" :elevation="10">
				<v-card-text class="d-flex font-weight-bold">
					<v-row>
						<v-col
							:md="userInfo?.getIsSupporting() ? '3' : '9'"
							:cols="userInfo?.getIsSupporting() ? '4' : '8'"
							class="align-self-center"
						>
							<v-icon>mdi-account</v-icon>
							<span class="mx-4">{{ onlinePlayers?.getOnlineUser() || "..." }}</span>
							<v-icon>mdi-account-cog</v-icon>
							<span class="mx-4">{{ onlinePlayers?.getOnlineAdmins() || "..." }}</span>
						</v-col>
						<v-col
							v-if="userInfo?.getIsSupporting()"
							:md="userInfo ? '5' : '5'"
							:cols="userInfo ? '4' : '4'"
							class="align-self-center"
						>
							<p>Estás apoyando a 4SAKEN.US, ganas mejoras!</p>
						</v-col>
						<v-col
							:md="userInfo?.getIsSupporting() ? '2' : '2'"
							:cols="userInfo?.getIsSupporting() ? '3' : '3'"
							:offset-md="userInfo?.getIsSupporting() ? '1' : '1'"
							:offset="userInfo?.getIsSupporting() ? '1' : '1'"
							class="align-self-center"
						>
							<v-avatar
								class="cursor-pointer"
								@click="openLink('https://discord.gg/GFasRy4wd4')"
								size="50"
							>
								<v-img width="auto" src="src/assets/social/discord.png"></v-img>
							</v-avatar>
							<v-avatar
								class="cursor-pointer"
								@click="openLink('https://steamcommunity.com/groups/4sakenus')"
								size="50"
							>
								<v-img width="auto" src="src/assets/social/steam.png"></v-img>
							</v-avatar>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { playerService } from "@/services/Player/PlayerService";
import InformationItemModel from "@/models/Player/InformationItemModel";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

import useSocket from "@/composables/useSocket";

import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();

const socket = useSocket();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const onlinePlayers = ref<InformationItemModel | null>(null);

const openLink = (link: string) => {
	window.open(link, "_blank");
};

const handleSocketEvents = () => {
	socket.on("user:join-room", () => {
		onlinePlayers.value?.setOnlineUsers();

		if (userInfo.value?.getRol() === 2) onlinePlayers.value?.setOnlineUsers();
	});

	socket.on("disconnect:user", (userInfo: PlayerItemModel) => {
		onlinePlayers.value?.removeOnlineUsers();

		if (userInfo?.getRol() === 2) onlinePlayers.value?.removeOnlineAdmins();
	});
};

const getOnlineUsers = async () => {
	try {
		const resp = await playerService.getOnlineUsers();
		onlinePlayers.value = new InformationItemModel(resp);
	} catch (err: any) {
		console.log(err);
	}
};

onMounted(() => {
	handleSocketEvents();
	getOnlineUsers();
});
</script>
