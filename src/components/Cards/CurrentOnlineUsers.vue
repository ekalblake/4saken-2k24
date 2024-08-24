<template>
	<div v-if="!onlinePlayers">
		<v-card class="online_bgc_cards online_progressbar_center">
			<v-progress-circular indeterminate color="primary" />
		</v-card>
	</div>
	<v-card v-else class="online_bgc_cards" min-height="650px">
		<h3 class="mx-auto text-center white--text my-2">
			{{
				$t("online_players_title") +
				": " +
				onlinePlayers.getPlayers().length
			}}
		</h3>
		<v-text-field
			class="px-5"
			dense
			color="white"
			v-model="playerListInput"
			append-icon="mdi-magnify"
			:label="$t('search_player')"
			outlined
			dark
			hide-details
		></v-text-field>
		<!-------------------------------->
		<!------------CARD BODY----------->
		<!-------------------------------->
		<v-card
			v-for="(online, i) of getPlayersFilter.getPlayers()"
			class="bgc d-flex pa-1 ma-2"
			:key="i"
		>
			<a :href="online.getProfileURL()" target="_blank">
				<v-avatar
					tile
					size="24px"
					:style="
						'box-shadow: 0px 0px 5px' + online.getColorChat() + ';'
					"
				>
					<img
						class="py-0"
						alt="Profile Pic"
						:src="online.getAvatarFull()"
					/>
				</v-avatar>
			</a>
			<v-card-text
				class="py-0 subtitle-2"
				:style="{
					color: online.getColorChat(),
					textShadow: '0 0 10px ' + online.getGlowColor(),
					fontWeight: 'bold',
				}"
			>
				{{ online.getPersonaName() }} | {{ online.getRating() }}
				<!-- | {{online.getMmrTeam()}}-->
			</v-card-text>
			<v-btn
				class="online_btn_report pa-0"
				@click="
					reportPlayer(online.getSteamId(), online.getPersonaName())
				"
			>
				Reportar
			</v-btn>
		</v-card>
	</v-card>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, onBeforeMount, computed } from "vue";
import PlayersModel from "@/models/Players/PlayersModel";
import { playerService } from "@/services/Player/PlayerService";
import INewUser from "@/interface/Players/INewUser";
import PlayerItemModel from "@/models/Players/PlayerItemModel";
import socketInstance from "@/services/socket";

export default defineComponent({
	name: "onlineUsers",
	setup() {
		const onlinePlayers: Ref<PlayersModel | null> = ref(null);

		const playerListInput = ref<string>("");

		const socketIo = () => {
			socketInstance.on("login:user", (userInfo: PlayerItemModel) => {
				let findIndex: any = onlinePlayers.value
					?.getPlayers()
					.filter(
						(item: PlayerItemModel) =>
							item.getUserId() === userInfo.UserID,
					);

				if (findIndex?.length > 0) return;
				onlinePlayers.value
					?.getPlayers()
					.push(new PlayerItemModel(userInfo));
			});

			socketInstance.on(
				"disconnect:user",
				(userInfo: PlayerItemModel) => {
					let removeIndex = onlinePlayers.value
						?.getPlayers()
						.map((item: PlayerItemModel) => item.getUserId())
						.indexOf(userInfo.UserID);

					if (removeIndex !== -1) {
						onlinePlayers.value
							?.getPlayers()
							.splice(removeIndex!, 1);
					}
				},
			);
		};
		/*******************************************************************************************************************
		 * GET ONLINE PLAYERS
		 * List all online players logged in the page.
		 * *******************************************************************************************************************/
		const getOnlineUsersList = async () => {
			const resp = await playerService.getOnlinePlayerList();

			onlinePlayers.value = new PlayersModel(resp);
		};

		const getPlayersFilter = computed<any>(() => {
			if (playerListInput.value == "") return onlinePlayers.value;

			const newPlayersArray: PlayerItemModel[] | undefined | INewUser[] =
				onlinePlayers.value?.getPlayers().filter((userName) => {
					return userName
						.getPersonaName()
						.includes(playerListInput.value);
				});
			//@ts-ignore
			return new PlayersModel(newPlayersArray);
		});

		const reportPlayer = (steamid: string, username: string) => {
			//window.open(`http://4saken.sourcebans.site.nfoservers.com/index.php?p=submit&steamid=${steamid}&nickname=${username}`)
			window.open(
				"https://discord.com/channels/893610141243555901/1001626482726142002",
			);
		};

		onBeforeMount(() => {
			socketIo();
			getOnlineUsersList();
		});

		return {
			onlinePlayers,
			reportPlayer,
			getPlayersFilter,
			playerListInput,
		};
	},
});
</script>
<style scoped>
.online_btn_report {
	height: 25px !important;
	margin: 5px;
	font-size: 10px;
	background-color: #910000 !important;
	color: #fff !important;
	text-transform: capitalize;
}
.online_bgc_cards {
	background: rgba(17, 17, 23, 0.5) !important;
	border-color: #ef4242 !important;
	box-shadow: 0 0 10px #910000 !important;
	text-align: center;
	overflow: auto;
	overflow-x: hidden;
	height: 690px;
}
.online_progressbar_center {
	min-height: 450px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
