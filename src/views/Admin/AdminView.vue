<template>
     <v-container fluid>
          <v-row>
               <v-col 
                    sm="12"
                    md="4" 
                    cols="12" 
                    v-for="(card, i) in cardInfo" :key="i"
               >
                    <v-card class="bgc_cards d-flex justify-center white--text">
                         <v-card-title>
                              <v-btn 
                                   text class="white--text" 
                                   @click="sendTo(card.router)"
                              >
                                   {{ card.title }}
                              </v-btn>
                         </v-card-title>
                    </v-card>
               </v-col>
               <router-view />
          </v-row>

     </v-container>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, SetupContext } from "vue";
import PlayersModel from "@/models/Players/PlayersModel";
import { WebPages } from "@/constants";

export default defineComponent({
     name: "AdminView.vue",
     setup(_, context : SetupContext) {
          const users: Ref<PlayersModel | null> = ref(null)

          const cardInfo: Ref<Array<object>> = ref([
               { title: 'Jugadores', router: WebPages.ADMIN_PLAYERS },
               { title: 'Mapas', router: WebPages.ADMIN_MAPS },
               { title: 'Servidores', router: WebPages.ADMIN_SERVERS }
          ])
          /**
           * Methods
           */

          const sendTo = (view: string) => {
               //@ts-ignore
               const router = context.root.$router

               router.push({
                    name: view
               })

          }

          return {
               users,
               cardInfo,
               sendTo
          }
     }
})
</script>

<style scoped>
.bgc_cards {
     background: rgba(17, 17, 23, 0.5) !important;
     border-color: #ef4242 !important;
     box-shadow: 0 0 10px #910000 !important;
     text-align: center;
     min-width: 250px
}
</style>