<template>
	<div v-if="!onlinePlayers">
		<v-card class="bgc-opacity-30 online_progressbar_center ma-3">
			<v-progress-circular indeterminate color="primary" />
		</v-card>
	</div>
	<v-list v-else class="bg-transparent ma-1 overflow-auto" min-height="650px">
		<v-list-item class="my-2 text-white rounded-lg">
			<v-text-field
				color="white"
				density="compact"
				v-model="playerListInput"
				append-icon="mdi-magnify"
				:label="t('search_player')"
				variant="outlined"
				hide-details
			></v-text-field>
		</v-list-item>
		<v-list-item
			v-for="(online, i) of getPlayersFilter.getPlayers()"
			lines="one"
			class="my-2 bgc-opacity-30 rounded-lg"
			:key="i"
		>
			<template v-slot:prepend>
				<v-avatar tile size="25" :style="online.getBackgroundColor()">
					<img height="30" alt="Profile Pic" :src="online.getAvatarFull()" />
				</v-avatar>
			</template>
			<template v-slot:default>
				<v-card-text
					:style="{
						color: online.getColorChat(),
						textShadow: '0 0 10px ' + online.getGlowColor(),
						fontWeight: 'bold',
					}"
				>
					{{ online.getPersonaName().substring(0, 19) }}
				</v-card-text>
			</template>
			<template v-slot:append>
				<v-tooltip location="top">
					<template v-slot:activator="{ props }">
						<v-avatar v-bind="props" variant="plain" rounded="0" size="35" :image="online.getMmrImage()">
						</v-avatar>
					</template>
					{{ online.getMmrName() }} - {{ online.getRating() }}
				</v-tooltip>
			</template>
		</v-list-item>
	</v-list>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import PlayersModel from "@/models/Player/PlayersModel";
import { playerService } from "@/services/Player/PlayerService";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

import useSocket from "@/composables/useSocket";

import { useI18n } from "vue-i18n";
import useEmitter from "@/composables/useEmitter";

const { t } = useI18n();

const emitter = useEmitter();

const socketInstance = useSocket();

const onlinePlayers = ref<PlayersModel | null>(null);

const playerListInput = ref<string>("");

const socketIo = () => {
	socketInstance.on("room:join-room", (userInfo: IPlayer) => {
		let findIndex: any = onlinePlayers.value
			?.getPlayers()
			.filter((item: PlayerItemModel) => item.getUserId() === userInfo.UserID);

		if (findIndex?.length > 0) return;
		onlinePlayers.value?.getPlayers().push(new PlayerItemModel(userInfo));
	});

	socketInstance.on("disconnect:user", (userInfo: IPlayer) => {
		let removeIndex = onlinePlayers.value
			?.getPlayers()
			.map((item: PlayerItemModel) => item.getUserId())
			.indexOf(userInfo.UserID);

		if (removeIndex !== -1) {
			onlinePlayers.value?.getPlayers().splice(removeIndex!, 1);
		}
	});
};

const getOnlinePlayers = () => {
	playerService
		.getOnlinePlayerList()
		.then((response) => {
			onlinePlayers.value = new PlayersModel(response.data.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const getPlayersFilter = computed<any>(() => {
	if (!onlinePlayers.value) return;

	if (playerListInput.value == "") return onlinePlayers.value;

	const newPlayersArray: any = onlinePlayers.value?.getPlayers().filter((userName) => {
		return userName.getPersonaName().includes(playerListInput.value);
	});
	return new PlayersModel(newPlayersArray);
});

onMounted(() => {
	getOnlinePlayers();
	socketIo();
});
</script>
<style scoped>
.online_progressbar_center {
	min-height: 450px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
