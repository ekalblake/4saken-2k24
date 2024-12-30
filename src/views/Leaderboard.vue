<template>
     <v-container>
          <h1 
               class="leaderboard pa-5 text-center text-uppercase font-weight-bold"
          >
               Leaderboard
          </h1>
          <v-row>
               <v-col 
                    cols="12" 
                    class="white--text"
               >
                    <v-card 
                         color="transparent" 
                         class="white--text"
                    >
                         <v-data-table
                              class="elevation-1 bgc1 mx-5 white--text" 
                              dark 
                              dense 
                              sort-by="Rating" 
                              :sort-desc="true"
                              min-height="300px" 
                              max-height="600px"
                              :headers="headers" 
                              :items="users?.getPlayers()" 
                              :loading="loading" 
                              :items-per-page="100"
                              :search="search" 
                              mobile-breakpoint
                         >
                              <template v-slot:top>
                                   <v-card-title>
                                        <v-spacer></v-spacer>
                                        <v-text-field 
                                             color="white" 
                                             v-model="search" 
                                             append-icon="mdi-magnify"
                                             :label="$t('search_player')" 
                                             outlined 
                                             dark 
                                             hide-details
                                        >
                                        </v-text-field>
                                   </v-card-title>
                              </template>
                              <template v-slot:item.personaname="{ item }">
                                   <a 
                                        :href="item.getProfileURL()" 
                                        target="_blank"
                                   >
                                        <v-avatar 
                                             tile 
                                             size="24px"
                                        >
                                             <img 
                                                  alt="Profile Pic" 
                                                  :src="item.getAvatarFull()"
                                             />
                                        </v-avatar>
                                   </a>
                                   <span
                                        :style="{ color: item.getColorChat(), textShadow: '0 0 10px ' + item.getGlowColor(), fontWeight: 'bold' }"
                                   >
                                        {{ item.getPersonaName() }}
                                   </span>
                              </template>
                              <template v-slot:item.report="{ item }">
                                   <v-btn 
                                        class="btn_report pa-0" 
                                        @click="reportPlayer()"
                                   >
                                        Reportar
                                   </v-btn>
                              </template>
                              <template v-slot:item.Rating="{ item }">
                                   {{  item.getRating() }}
                              </template>
                              <template v-slot:item.ranked="{ item }">
                                   <v-avatar 
                                        class="ma-2"
                                        tile 
                                        size="35px"
                                   >
                                        <v-img
                                             alt="novice"
                                             :src="require(`@/assets/ranked_medals/${item.getMmrImage()}`)"
                                        />
                                   </v-avatar>
                              </template>
                              <template v-slot:item.created_at="{ item }">
                                   {{ item.getCreatedAt() }}
                              </template>
                         </v-data-table>
                    </v-card>
               </v-col>
          </v-row>
     </v-container>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { playerService } from "@/services/Player/PlayerService";
import { DataTableHeader } from "vuetify";
import PlayersModel from "@/models/Players/PlayersModel";

export default defineComponent({
     name: "LeaderboardView",
     setup() {

          const users: Ref<PlayersModel | null> = ref(null)

          const loading: Ref<boolean> = ref(true)

          const headers: Ref<DataTableHeader[] | null> = ref([
               {
                    text: '',
                    sortable: false,
                    value: 'number'
               },
               { text: 'Perfil', value: 'personaname', filterable: true },
               { text: 'Steam ID', value: 'SteamID64' },
               { text: 'Report', value: 'report' },
               { text: 'MMR', value: 'Rating' },
               { text: 'Rank', value: 'ranked' },
               { text: 'Registrado', value: 'created_at' },
          ])

          const search: Ref<string> = ref('')

          const getOnlineUsers = async () => {
               const response = await playerService.getUsers()
               
               users.value = new PlayersModel(response);
               loading.value = false;
          }

          const reportPlayer = () => {
               //window.open(`http://4saken.sourcebans.site.nfoservers.com/index.php?p=submit&steamid=${steamid}&nickname=${username}`)
               window.open('https://discord.com/channels/893610141243555901/1001626482726142002')
          }

          onMounted(() => {
               getOnlineUsers()
          })


          return {
               headers,
               search,
               users,
               loading,
               getOnlineUsers,
               reportPlayer
          }
     },
});

</script>
<style scoped>
.bgc1 {
     background: rgba(145, 0, 0, 0.1) !important;
}

.leaderboard {
     color: #910000;
}

.btn_report {
     background-color: #910000 !important;
     color: #fff !important;
     font-size: 10px;
     padding: 0px;
     margin: 0px;
     text-transform: capitalize;
}
</style>