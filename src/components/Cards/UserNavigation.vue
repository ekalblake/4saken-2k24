<template>
	<v-card class="bgc_cards text-white rounded-lg" height="auto">
		<div class="text-center bg-transparent" :elevation="0">
			<div class="d-flex justify-center">
				<v-img :src="userInfo?.getMmrImage()" height="120" width="auto" />
			</div>
			<v-card-text> {{ userInfo?.getMmrName() }} - {{ userInfo?.getRating() }} </v-card-text>
		</div>
		<v-card-actions v-if="partyInfo" class="d-flex flex-column">
			<v-row>
				<v-col cols="3">
					<v-tooltip location="top" :text="partyInfo.getParty().getLeaderName()">
						<template v-slot:activator="{ props }">
							<v-avatar tile v-bind="props" size="75" :style="partyInfo.getParty().getBackgroundColor()">
								<v-img :src="partyInfo.getParty().getAvatarFull()"> </v-img>
								<v-icon class="position-absolute top-0" color="success" size="large">
									mdi-crown
								</v-icon>
							</v-avatar>
						</template>
					</v-tooltip>
				</v-col>
				<v-col v-for="index of 3" cols="3">
					<v-tooltip location="top" :text="getPlayerInfo(index)?.name">
						<template v-slot:activator="{ props }">
							<v-avatar tile v-bind="props" size="75" :style="getPlayerInfo(index)?.glowColor">
								<v-img v-bind="props" :src="getPlayerInfo(index)?.avatar"> </v-img>
							</v-avatar>
						</template>
					</v-tooltip>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<v-chip class="bg-fs-primary"> {{ partyInfo.getParty().getPartyCode() }}</v-chip>
				</v-col>
			</v-row>
		</v-card-actions>
		<v-card-actions class="justify-center">
			<template v-if="partyInfo">
				<v-btn
					v-if="partyInfo.getParty().getLeaderId() == userInfo?.getUserId()"
					@click="deleteParty(partyInfo.getParty().getPartyId())"
					v-bind="props"
					:disabled="isJoined"
					icon="mdi-delete"
					class="bg-error rounded-lg"
				>
				</v-btn>
				<v-btn
					v-else
					@click="dropParty(partyInfo.getParty().getPartyId())"
					v-bind="props"
					:disabled="isJoined"
					icon="mdi-delete"
					class="bg-error rounded-lg"
				>
				</v-btn>
			</template>
			<v-menu v-if="!partyInfo" :close-on-content-click="false" location="left">
				<template v-slot:activator="{ props }">
					<v-btn
						:disabled="isJoined"
						v-bind="props"
						icon="mdi-account-group"
						class="bg-fs-primary rounded-lg"
					>
					</v-btn>
				</template>
				<v-card class="bg-grey-darken-4" min-width="300px">
					<v-card-item>
						<v-card-title> Juega con tus amigos </v-card-title>
					</v-card-item>
					<v-card-actions>
						<v-btn @click="createParty" block class="bg-fs-primary"> Crear sala </v-btn>
					</v-card-actions>
					<v-divider thickness="5" class="ma-3"></v-divider>
					<v-card-item>
						<v-card-title> Únete a una partida </v-card-title>
					</v-card-item>
					<v-card-text>
						<v-text-field v-model="partyCode" hide-details label="Introduce un código"> </v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-btn :disabled="!partyCode" @click="joinParty" block class="bg-fs-primary">
							Únete a una sala
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-menu>
			<v-menu :close-on-content-click="false" location="top">
				<template v-slot:activator="{ props }">
					<v-btn
						:disabled="isJoined"
						v-bind="props"
						icon="mdi-earth"
						class="bg-fs-primary rounded-lg text-white pa-4 align-content-center"
					>
					</v-btn>
				</template>
				<v-card class="bg-grey-darken-4">
					<v-card-text> Selecciona la región dónde deseas jugar. </v-card-text>
					<v-divider class="mx-2"></v-divider>
					<v-card-text>
						<v-chip-group
							@update:modelValue="updateRegion"
							v-model="selectedRegion"
							selected-class="bg-success"
							multiple
						>
							<v-chip value="SA">SA</v-chip>
							<v-chip value="NA">NA</v-chip>
							<v-chip value="EUR">EUR</v-chip>
						</v-chip-group>
					</v-card-text>
				</v-card>
			</v-menu>
			<v-btn disabled icon="mdi-map" class="bg-fs-primary rounded-lg text-white pa-4 align-content-center">
			</v-btn>
			<template v-if="!partyInfo">
				<v-btn
					class="bg-fs-primary rounded-lg text-white text-decoration-none pa-4 align-content-center"
					:loading="isDisabled"
					v-if="!isJoined"
					@click="joinQueue"
				>
					ENTRAR A LA COLA
				</v-btn>
				<v-btn
					v-else
					class="bg-fs-secondary rounded-lg text-white text-decoration-none pa-4 align-content-center"
					:disabled="justJoined"
					@click="dropQueue"
				>
					{{ counter }}
				</v-btn>
			</template>
			<template v-else>
				{{ partyInfo.getParty().getLeaderId() }} - {{ userInfo?.getUserId() }}
				<v-btn
					:disabled="partyInfo.getParty().getLeaderId() != userInfo?.getUserId()"
					v-if="!isJoined"
					class="bg-fs-primary rounded-lg text-white text-decoration-none pa-4 align-content-center"
					:loading="isDisabled"
					@click="joinQueueParty"
				>
					ENTRAR A LA COLA
				</v-btn>
				<v-btn
					v-else
					:disabled="partyInfo.getParty().getLeaderId() != userInfo?.getUserId()"
					class="bg-fs-secondary rounded-lg text-white text-decoration-none pa-4 align-content-center"
					@click="dropQueueParty"
				>
					{{ counter }}
				</v-btn>
			</template>
		</v-card-actions>
	</v-card>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

import { useUserStore } from "@/store/userStore";

import { queuesService } from "@/services/Queues/QueuesService";
import useEmitter from "@/composables/useEmitter";
import useSocket from "@/composables/useSocket";
import { playerService } from "@/services/Player/PlayerService";
import PartyItemModel from "@/models/Player/PartyItemModel";

const userStore = useUserStore();

const emitter = useEmitter();

const socket = useSocket();

const userInfo = computed(() => userStore.userInfo);

const props = defineProps<{
	gameType: number;
}>();

const isJoined = ref<boolean>(false);

const isDisabled = ref<boolean>(false);

const selectedRegion = ref<string[]>([]);

const justJoined = ref<boolean>(true);

const counter = ref<string>("00:00");

const intervalId = ref<any>();

const partyInfo = ref<PartyItemModel | null>(null);

const partyCode = ref<string>("");

const joinQueue = () => {
	queuesService
		.joinQueue(props.gameType)
		.then((response) => {
			isJoined.value = true;

			socket.emit("queue:join-queue", {
				room: props.gameType,
				userInfo: response.data.data,
			});

			startCounter();

			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const joinQueueParty = () => {
	if (!partyInfo.value) return;
	queuesService
		.joinPartyQueue(props.gameType, partyInfo.value.getParty().getPartyId())
		.then((response) => {
			socket.emit("queue:party-join-queue", {
				room: props.gameType,
				members_id: response.data.data.members_id,
			});

			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const dropQueueParty = () => {
	if (!partyInfo.value) return;
	queuesService
		.dropPartyQueue(partyInfo.value.getParty().getPartyId())
		.then((response) => {
			console.log(response);
			socket.emit("queue:party-drop-queue", {
				room: props.gameType,
				members_id: response.data.data.members_id,
			});

			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const dropQueue = () => {
	queuesService
		.dropQueue()
		.then((response) => {
			isJoined.value = false;

			justJoined.value = true;

			clearInterval(intervalId.value);

			counter.value = "00:00";

			socket.emit("queue:drop-queue", {
				userid: userInfo.value?.getUserId(),
				room: props.gameType,
			});

			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			console.log(err);
			emitter.emit("alert", err.response.data);
		});
};

const startCounter = () => {
	clearInterval(intervalId.value);
	setTimeout(() => {
		if (justJoined.value == true) {
			justJoined.value = false;
		}
	}, 3000);

	let minutes = 0;
	let seconds = 0;

	intervalId.value = setInterval(() => {
		seconds++;

		if (seconds === 60) {
			seconds = 0;
			minutes++;
		}

		let formattedMinutes = minutes.toString().padStart(2, "0");
		let formattedSeconds = seconds.toString().padStart(2, "0");

		counter.value = `${formattedMinutes}:${formattedSeconds}`;

		if (isJoined.value == false) {
			clearInterval(intervalId.value);
			counter.value = "00:00";
		}
	}, 1000);
};

const updateRegion = (value: string[]) => {
	const parsedRegions = JSON.stringify(value);
	playerService
		.updateRegions(parsedRegions)
		.then((response) => {
			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const verifyParty = () => {
	playerService
		.verifyParty()
		.then((response) => {
			if (response.data.data.party) {
				partyInfo.value = new PartyItemModel(response.data.data);
			}
		})
		.catch((err) => {
			partyInfo.value = null;
			emitter.emit("alert", err.response.data);
		});
};

const getPlayerInfo = (index: number): any => {
	if (partyInfo.value) {
		const players = partyInfo.value.getMembers().getPlayers();

		if (index <= players.length) {
			return {
				avatar: players[index - 1].getAvatarFull(),
				name: players[index - 1].getPersonaName(),
				glowColor: players[index - 1].getColorStyle(),
				colorChat: players[index - 1].getColorChat(),
			};
		}
		return {
			avatar: "src/assets/question_mark.jpg",
			name: "Esperando jugador...",
			glowColor: "box-shadow: 0px 0px 5px #D9D9D9;",
			colorChat: "#D9D9D9",
		};
	}
};

const createParty = () => {
	playerService
		.newParty()
		.then((response) => {
			verifyParty();
			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const joinParty = () => {
	playerService
		.joinParty(partyCode.value)
		.then((response) => {
			verifyParty();
			response.data.data.forEach((memberId: number) => {
				socket.emit("queue:drop-party-member", memberId);
			});

			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const deleteParty = (party_id: number) => {
	playerService
		.dropParty(party_id)
		.then((response) => {
			partyInfo.value = null;

			response.data.data.forEach((memberId: number) => {
				socket.emit("queue:drop-party-member", memberId);
			});

			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const dropParty = (party_id: number) => {
	playerService
		.dropPartyMember(party_id)
		.then((response) => {
			partyInfo.value = null;
			isJoined.value = false;

			response.data.data.forEach((memberId: number) => {
				socket.emit("queue:drop-party-member", memberId);
			});

			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

onMounted(() => {
	verifyParty();

	emitter.on("queue:verify-queue", () => {
		isJoined.value = true;
		startCounter();
	});

	socket.on("queue:player-dropped-single", () => {
		isJoined.value = false;
		clearInterval(intervalId.value);
		counter.value = "00:00";
	});

	socket.on("queue:party-join-single", () => {
		isJoined.value = true;
		clearInterval(intervalId.value);
		startCounter();
	});

	socket.on("queue:drop-party-member", () => {
		partyInfo.value = null;
		verifyParty();
	});
});

onBeforeUnmount(() => {
	clearInterval(intervalId.value);
});
</script>
<style scoped></style>
