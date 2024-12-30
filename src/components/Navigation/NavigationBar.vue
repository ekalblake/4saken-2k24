<template>
	<v-app-bar app class="bgc_cards text-white" density="compact">
		<template v-slot:prepend>
			<v-tabs density="compact" hide-slider class="d-none d-md-block position-absolute">
				<v-tab to="/">{{ t("inicio") }}</v-tab>
				<v-tab to="/faq">{{ t("faq") }}</v-tab>
				<v-tab to="/leaderboard">{{ t("leaderboard") }}</v-tab>
				<!-- <v-tab to="/about">{{ t("about_us") }}</v-tab>
				<v-tab to="/partners">{{ t("partners") }}</v-tab>
				<v-tab to="/prime">{{ t("prime") }}</v-tab>
				<v-tab to="/servers">{{ t("servers") }}</v-tab> -->
			</v-tabs>
			<v-app-bar-nav-icon class="d-md-none" @click="sidebar = !sidebar"> </v-app-bar-nav-icon>
		</template>
		<v-spacer></v-spacer>
		<RouterLink class="d-none d-md-block" to="/">
			<v-img height="30" width="auto" src="src/assets/logos/LOGO CONNECT@56.png" />
		</RouterLink>
		<v-spacer />
		<template v-if="!userInfo">
			<v-btn icon="mdi-steam" class="mx-1" @click="steamLogin()"></v-btn>
		</template>
		<template v-else>
			<v-menu :close-on-content-click="false" location="left">
				<template v-slot:activator="{ props }">
					<v-avatar :style="userInfo.getBoxShadow()" class="cursor-pointer mx-3" v-bind="props">
						<v-img alt="Profile Pic" :src="userInfo.getAvatarFull()" />
					</v-avatar>
				</template>
				<v-list class="bgc_cards text-white">
					<v-list-item class="bg-transparent">
						<template v-slot:prepend>
							<v-icon>mdi-flag</v-icon>
						</template>
						<v-select
							style="max-width: 130px"
							dense
							outlined
							hide-details
							:items="langOptions"
							item-text="title"
							item-value="id"
							v-model="selectedLang"
						>
						</v-select>
					</v-list-item>
					<v-list-item>
						<template v-slot:prepend>
							<v-icon>mdi-cog</v-icon>
						</template>
						<RouterLink class="text-decoration-none text-white" to="/configuration">
							Configuración
						</RouterLink>
					</v-list-item>
					<v-list-item v-if="userInfo.getRol() == 2">
						<template v-slot:prepend>
							<v-icon>mdi-account-cog</v-icon>
						</template>
						<RouterLink class="text-decoration-none text-white" to="admin"> Administrar </RouterLink>
					</v-list-item>
					<v-spacer></v-spacer>
					<v-list-item @click="logout()">
						<template v-slot:prepend>
							<v-icon>mdi-logout</v-icon>
						</template>
						Salir
					</v-list-item>
				</v-list>
			</v-menu>
		</template>
	</v-app-bar>
	<v-navigation-drawer app temporary hide-overlay v-model="sidebar" class="bgc_cards text-white">
		<v-list>
			<v-list-item v-if="userInfo">
				<template v-slot:prepend>
					<v-avatar :style="userInfo.getBoxShadow()" class="cursor-pointer mx-3">
						<v-img :src="userInfo.getAvatarFull()" />
					</v-avatar>
				</template>
				{{ userInfo.getPersonaName() }}
			</v-list-item>
			<v-divider class="ma-2"></v-divider>
			<v-list-item to="/">
				{{ t("inicio") }}
			</v-list-item>
			<v-list-item to="/faq">
				{{ t("faq") }}
			</v-list-item>
			<v-list-item to="leaderboard">
				{{ t("leaderboard") }}
			</v-list-item>
			<v-list-item to="/about">
				{{ t("about_us") }}
			</v-list-item>
			<v-list-item to="/partners">
				{{ t("partners") }}
			</v-list-item>
			<v-list-item to="/prime">
				{{ t("prime") }}
			</v-list-item>
			<v-list-item to="/servers">
				{{ t("servers") }}
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { API_URL } from "@/constants/constants";

import PlayersItemModel from "@/models/Player/PlayerItemModel";
import { useI18n } from "vue-i18n";

import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();

const userInfo = computed<PlayersItemModel | null>(() => userStore.userInfo as PlayersItemModel | null);

const { t, locale } = useI18n();

const sidebar = ref<boolean>(false);

const langOptions = [
	{
		id: "es",
		title: "Español",
	},
	{
		id: "en",
		title: "English",
	},
];

const steamLogin = () => {
	window.open(API_URL + "/auth/login", "_self");
};

const selectedLang = ref(langOptions.find((lang) => lang.id === locale.value)?.id || "en");

const logout = () => {
	userStore.setUserInfoNull();
};

watch(selectedLang, (newLang) => {
	locale.value = newLang;
});
</script>

<style scoped></style>
