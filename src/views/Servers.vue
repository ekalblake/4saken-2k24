<template>
     <v-container>
          <h1 class="server_title pa-5 text-center text-uppercase font-weight-bold">
     {{$t('server_title')}}
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
                              dark 
                              dense 
                              items-per-page.sync="100" 
                              min-height="300px" 
                              max-height="600px"
                              :headers="headers" 
                              :items="serverList.serverInfoArray" 
                              :loading="loading"
                              :items-per-page="10" 
                              class="elevation-1 bgc1 mx-5 white--text" 
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
                                             :label="$t('server_search')" 
                                             outlined 
                                             dark 
                                             hide-details
                                        >
                                        </v-text-field>
                                   </v-card-title>
                              </template>
                              <template v-slot:item.numplayers="{item}">
                                   <h4 class="justify-center white--text">
                                        {{ item.getNumPlayers()}}/{{item.getMaxPlayers()}}
                                        <v-menu 
                                             v-if="item.getNumPlayers() != 0" 
                                             right
                                        >
                                        <template v-slot:activator="{ on, attrs }">
                                             <v-btn 
                                                  text 
                                                  dark 
                                                  v-bind="attrs" 
                                                  v-on="on" 
                                                  depressed 
                                                  plain
                                             >
                                                  <v-icon size="20">mdi-arrow-down-bold</v-icon>
                                             </v-btn>
                                        </template>
                                        <v-list
                                        >
                                             <v-list-item 
                                                  v-for="(player, i) in item.getPlayers()"
                                                  :key="i">
                                                  <v-list-item-title>{{ player }}</v-list-item-title>
                                             </v-list-item>
                                        </v-list>
                                        </v-menu>
                                   </h4>
                              </template>
                              <template v-slot:item.join="{ item }">
                                   <v-btn 
                                        class="btn_join pa-0"
                                        @click="joinGame(item.getIp())"
                                   >
                                        Entrar
                                   </v-btn> 
                              </template>
                         </v-data-table>
                    </v-card>
               </v-col>
          </v-row>
     </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { adminService } from "@/services/Admin/AdminService";
import ServerInfoModel from "@/models/Admin/ServerInfoModel";
import { DataTableHeader } from "vuetify";

export default defineComponent({
      name: "ServersView",
      setup() {

            let serverList: Ref<ServerInfoModel | Array<[]>> = ref([])

            /**
             * 
             */
            const loading: Ref<boolean> = ref(true)

            /**
             *
             */
            const headers: Ref<DataTableHeader[] | null> = ref([
                  {
                        text: '',
                        sortable: false,
                        value: 'number'
                  },
                  { text: 'Nombre', value: 'name', filterable: true },
                  { text: 'IP', value: 'ip' },
                  { text: 'Jugadores', value: 'numplayers' },
                  { text: 'Mapa', value: 'map' },
                  { text: 'Entrar', value: 'join' }
            ])
            /**
             *
             */
            const search: Ref<string> = ref('')

            const getServerList = async () => {
                  let responseServer = await adminService.getServerListPublic()
                  serverList.value = new ServerInfoModel(responseServer)
                  loading.value = false
            }
            
            /**
             *
             */
            const joinGame = (ip: string, )  : void=> {
                  window.open(`steam://connect/${ip}`)

            }
            onMounted(() => {
                  getServerList()
            })

            return {
                  serverList,
                  loading,
                  headers,
                  search,
                  getServerList,
                  joinGame
            }

      }
})
</script>

<style scoped>
.bgc1 {
      background: rgba(56, 52, 52, 0.3) !important;
      border-color: #ef4242;
      box-shadow: 0 0 10px #c20606;
}

.btn_join {
      height:20px !important;
      margin: 5px;
      font-size: 10px;
      background-color: #c20606 !important;
      color: #fff !important;
      text-transform: capitalize;
}

.server_title {
      color: #a70303;
}
</style>