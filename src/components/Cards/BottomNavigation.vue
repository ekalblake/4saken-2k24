<template>
	<v-bottom-navigation grow class="bgc_cards" height="auto">
		<v-row>
			<v-col cols="12">
				<v-card class="bgc_cards text-white" height="auto">
					<v-row>
						<v-col cols="2" md="2">
							<v-img
								cover
								:src="`src/assets/ranked_medals/${userInfo?.getMmrImage()}`"
								height="80"
								width="80"
							/>
						</v-col>
						<v-col cols="3" md="3" offset-md="6" offset-lg="7" offset-sm="4" offset="3">
							<v-card-actions class="justify-space-around">
								<v-btn
									disabled
									size="small"
									icon="mdi-earth"
									class="bg-fs-primary rounded-lg text-white text-decoration-none pa-4 align-content-center"
								>
								</v-btn>
								<v-menu :close-on-content-click="false" location="left">
									<template v-slot:activator="{ props }">
										<v-btn
											disabled
											v-bind="props"
											size="small"
											icon="mdi-account-group"
											class="bg-fs-primary rounded-lg text-white text-decoration-none pa-4 align-content-center"
										>
										</v-btn>
									</template>
									<v-card class="bg-grey-darken-4" min-width="300px">
										<v-card-item>
											<v-card-title> Juega con tus amigos </v-card-title>
										</v-card-item>
										<v-card-actions>
											<v-btn block class="bg-fs-primary"> Crear sala </v-btn>
										</v-card-actions>
										<v-divider thickness="5" class="ma-3"></v-divider>
										<v-card-item>
											<v-card-title> Únete a una partida </v-card-title>
										</v-card-item>
										<v-card-text>
											<v-text-field hide-details label="Introduce un código"> </v-text-field>
										</v-card-text>
										<v-card-actions>
											<v-btn block class="bg-fs-primary"> Únete a una sala </v-btn>
										</v-card-actions>
									</v-card>
								</v-menu>
								<v-btn
									disabled
									size="small"
									icon="mdi-map"
									class="bg-fs-primary rounded-lg text-white text-decoration-none pa-4 align-content-center"
								>
								</v-btn>
								<v-btn
									size="small"
									class="bg-fs-primary rounded-lg text-white text-decoration-none pa-4 align-content-center"
									:loading="isDisabled"
									v-if="!isJoined"
									@click="joinQueue"
								>
									ENTRAR A LA COLA
								</v-btn>

								<v-btn
									v-else
									size="small"
									class="bg-fs-secondary rounded-lg text-white text-decoration-none align-content-center"
									@click="dropQueue"
								>
									Salir de la cola
								</v-btn>
							</v-card-actions>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
		</v-row>
	</v-bottom-navigation>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

import { useUserStore } from "@/store/userStore";

import { queuesService } from "@/services/Queues/QueuesService";
import useEmitter from "@/composables/useEmitter";

const userStore = useUserStore();

const emitter = useEmitter();

const userInfo = computed(() => userStore.userInfo);

const props = defineProps<{
	gameType: number;
}>();

const isJoined = ref<boolean>(false);

const isDisabled = ref<boolean>(false);

const joinQueue = async () => {
	queuesService
		.joinQueue(props.gameType)
		.then(() => {
			isJoined.value = true;
		})
		.catch((err) => {
			console.log(err);
		});
};

const dropQueue = async () => {
	queuesService
		.dropQueue(userInfo.value?.getUserId(), props.gameType)
		.then(() => {
			isJoined.value = false;
		})
		.catch((err) => {
			console.log(err);
		});
};

onMounted(() => {
	emitter.on("queue:verify-queue", () => {
		isJoined.value = true;
	});
});
</script>
<style scoped></style>
