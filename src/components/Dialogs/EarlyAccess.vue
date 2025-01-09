<template>
	<v-dialog
		content-class="bgc"
		:value="dialog"
		persistent
		overlay-color="black"
		open-delay="2000"
		max-width="1000"
		retain-focus
		overlay-opacity="0.8"
		dark
	>
		<v-card class="bgc px-9 py-3 text-center">
			<div class="d-flex justify-center align-content-center">
				<v-img max-width="100px" max-height="100px" src="@/assets/logo.svg"></v-img>
			</div>
			<v-card-title class="title text-h6 justify-center mb-5 pt-0"> {{ $t("early_access_1") }}~ </v-card-title>
			<v-card-text class="white--text text-uppercase font-weight-bold pt-0">
				<span class="text-subtitle-2"
					><span class="rojo">4SAKEN.US</span> {{ $t("early_access_2") }} {{ porcentaje }}%).</span
				><br />
				<span class="text-subtitle-2">{{ $t("early_access_3") }}</span
				><br />
				<br />
				<span class="text-subtitle-2"
					>{{ $t("early_access_4") }}
					<a href="https://discord.gg/GFasRy4wd4" target="_blank"><span>Discord</span></a>
					{{ $t("early_access_5") }}</span
				><br />
				<span class="text-subtitle-2">{{ $t("early_access_6") }}</span>
			</v-card-text>
			<v-card-actions class="justify-center">
				<v-btn color="btn" @click="$emit('verify-dialog', false)">
					{{ $t("early_access_7") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
	dialog: boolean;
}>();

const porcentaje = ref<number>(83);
</script>

<style scoped>
.title {
	color: #af2828 !important;
	font-weight: bold;
}
.rojo {
	color: #9d1010 !important;
}
.bgc {
	background: rgba(13, 13, 16, 0.5) !important;
	border-color: #ef4242 !important;
	box-shadow: 0 0 10px #910000 !important;
	max-width: 1000px;
}
.btn {
	border-radius: 10px;
	background-color: #910000 !important;
	color: #fff !important;
	align-content: center !important;
	padding: 5px;
	text-decoration: none;
	padding: 10px !important;
}
</style>
