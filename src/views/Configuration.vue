<template>
	<v-container fluid>
		<v-row class="h-100">
			<v-col cols="12">
				<OnlineInfo />
			</v-col>
			<v-col v-if="userInfo" cols="12" class="d-flex justify-center">
				<v-card
					width="auto"
					min-height="600"
					height="auto"
					:style="userInfo.getBoxShadow()"
					class="configuration_bgc_cards text-white"
				>
					<div class="container-info">
						<v-img class="my-3 mx-auto" height="150" width="auto" :src="userInfo.getAvatarFull()" />
						<v-card-item>
							<v-card-subtitle class="text-h6">
								<p class="font-weight-bold" :style="userInfo.getColorChatStyle()">
									{{ userInfo.getPersonaName() }}
								</p>

								<p>Solo MMR: {{ userInfo.getRating() }}</p>
								<p>Team MMR: {{ userInfo.getRatingDuel() }}</p>
							</v-card-subtitle>
						</v-card-item>
						<v-card-actions class="d-flex justify-space-around">
							<v-menu
								v-model="menu1"
								:close-on-content-click="false"
								transition="scale-transition"
								offset-y
								:disabled="userInfo.getRol() == 1 || userInfo.getIsPremium() == 0 ? true : false"
							>
								<template v-slot:activator="{ props }">
									<v-btn v-bind="props" variant="outlined" :color="colorChat" fab>TEXTO</v-btn>
								</template>
								<v-color-picker
									v-model="colorChat"
									dot-size="11"
									hide-mode-switch
									mode="hexa"
									swatches-max-height="149"
								>
								</v-color-picker>
							</v-menu>
							<v-menu
								v-model="menu2"
								:close-on-content-click="false"
								:disabled="userInfo.getRol() == 1 || userInfo.getIsPremium() == 0 ? true : false"
							>
								<template v-slot:activator="{ props }">
									<v-btn v-bind="props" variant="outlined" :color="glowColor"> Glow</v-btn>
								</template>
								<v-color-picker
									v-model="glowColor"
									dot-size="11"
									hide-mode-switch
									mode="hexa"
									swatches-max-height="149"
								>
									>
								</v-color-picker>
							</v-menu>
						</v-card-actions>
						<v-card-actions class="d-flex justify-center">
							<v-btn
								:color="userInfo.getGlowColor()"
								variant="elevated"
								class="bg-fs-primary"
								@click="saveColor"
								>Guardar cambios</v-btn
							>
						</v-card-actions>
						<v-card-text class="text-body-1">
							<p v-if="userInfo.getRol() == 1">
								<router-link to="/premium">Solicita Premium aquí</router-link>
							</p>
							<p v-else-if="userInfo.getRol() == 2">Eres admin, tienes Premium para siempre!</p>
							<p v-else-if="userInfo.getRol() == 3">Estado de suscripción: Por evaluar</p>
						</v-card-text>
					</div>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue";

import OnlineInfo from "@/components/Cards/OnlineInformation.vue";

import PlayersItemModel from "@/models/Player/PlayerItemModel";

import { playerService } from "@/services/Player/PlayerService";

import { useUserStore } from "@/store/userStore";

import useEmitter from "@/composables/useEmitter";

const userStore = useUserStore();

const emitter = useEmitter();

const userInfo = computed<PlayersItemModel | null>(() => userStore.userInfo as PlayersItemModel);

const menu1 = ref<boolean>(false);
const menu2 = ref<boolean>(false);

const colorChat = ref(userInfo.value?.getColorChat());

const glowColor = ref(userInfo.value?.getGlowColor());

const saveColor = async () => {
	if (!colorChat.value && glowColor.value) {
		emitter.emit("alert", {
			message: "Por favor selecciona un color",
			success: false,
		});
		return;
	}

	await playerService
		.saveConfiguration(colorChat.value, glowColor.value)
		.then((response) => {
			userInfo.value?.setChatColor(colorChat.value);
			userInfo.value?.setGlowColor(glowColor.value);

			emitter.emit("alert", response.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

watch(colorChat, () => {
	if (colorChat.value === "undefined") {
		colorChat.value = userInfo.value?.getColorChat();
	} else {
		colorChat.value;
	}
});

watch(glowColor, () => {
	glowColor.value;
});
</script>

<style scoped>
.configuration_bgc_cards {
	background: rgba(17, 17, 23, 0.7) !important;
	border-color: #ef4242 !important;
	text-align: center;
}

/* .configuration_btn {
	border-radius: 10px;
	background-color: #910000 !important;
	color: #fff !important;
	align-content: center !important;
	text-decoration: none;
	font-size: 12px !important;
} */

.container-info {
	display: flex;
	flex-direction: column;
	height: 100%;
}
</style>
