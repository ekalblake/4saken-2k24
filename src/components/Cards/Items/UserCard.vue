<template>
	<v-card :min-width="minWidth" v-if="userCard" class="text-center pa-2 bg-fs-primary text-white" tile>
		<v-img class="mx-auto" width="auto" height="150px" :src="userCard.getAvatarFull()"> </v-img>
		<v-card-title>
			{{ userCard.getPersonaName() }}
		</v-card-title>
		<v-card-text>
			<ul class="list-unstyled">
				<li class="d-flex justify-space-between align-items-center py-1">
					<v-tooltip text="Nombre Completo">
						<template v-slot:activator="{ props }">
							<v-chip v-bind="props"> Partidas jugadas </v-chip>
						</template>
					</v-tooltip>
					<p>
						{{ userCard.getGamesPlayed() }}
					</p>
				</li>
				<li class="d-flex justify-space-between align-items-center py-1">
					<v-tooltip text="Cuenta de Steam Creada">
						<template v-slot:activator="{ props }">
							<v-chip v-bind="props"> MMR Individual </v-chip>
						</template>
					</v-tooltip>
					<p>
						{{ userCard.getRating() }}
					</p>
				</li>
				<li class="d-flex justify-space-between align-items-center py-1">
					<v-tooltip text="Cuenta Creada en Happy Trade">
						<template v-slot:activator="{ props }">
							<v-chip v-bind="props"> MMR Duo </v-chip>
						</template>
					</v-tooltip>
					<p>
						{{ userCard.getRatingDuel() }}
					</p>
				</li>
			</ul>
		</v-card-text>
	</v-card>
</template>
<script setup lang="ts">
import type UserItemModel from "@/models/Player/PlayerItemModel";

defineProps<{
	userCard: UserItemModel | null | undefined;
	minWidth: string;
}>();
</script>
