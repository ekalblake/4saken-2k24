<template>
     <v-dialog 
        v-model="isGameStarted" 
        open-delay="2000"
        max-width="800"
        color="black"
        persistent
    >
          <template v-if="!gameObject">
          </template>
          <template v-else>
               <v-system-bar
                         window
                         dark
                    >
                    <span>Game Started</span>
                    <v-spacer></v-spacer>
                    <v-icon
                         @click="$emit('close-game-dialog')"
                    >
                         mdi-close
                    </v-icon>
               </v-system-bar>
               <v-card 
                    class="chat_bgc_cards pa-5"
               >
                    <div
                         class="mb-5"
                    >
                         <v-row class="justify-center pa-2">
                              <v-img
                                   src="@/assets/match/match_found.png"
                                   max-width="200"
                                   height="100"
                              />
                         </v-row>
                         <v-row
                              class="pa-0 justify-center pb-3"
                              style="margin-top: -60px"

                         >
                              <div
                                   class="text-body-2 font-weight-bold px-5"
                              >
                                   <div class="d-flex justify-center">
                                        <v-img
                                        src="@/assets/match/SURVIVOR.png"
                                        max-width="160"
                                        height="200"
                                        />
                                   </div>
                                   <v-card
                                        class="chat_bgc_game py-2"
                                   >
                                        <div
                                             class="d-flex white--text px-3 py-1 justify-space-between align-center"
                                             v-for="(teamA,i) in JSON.parse(gameObject.getTeamA())"
                                             :key="i"
                                        >
                                             <span>
                                                  {{ teamA.personaname }}
                                             </span>
                                             <v-avatar
                                                  size="40"
                                             >
                                                  <v-img  :src="teamA.avatarfull"/>
                                             </v-avatar>
                                        </div>
                                   </v-card>
                              </div>
                              <div
                                   class="text-body-2 font-weight-bold px-5"
                              >
                                   <div
                                        class="d-flex justify-center"
                                   >
                                        <v-img
                                             src="@/assets/match/INFECTED.png"
                                             max-width="160"
                                             height="200"
                                        />
                                   </div>
                                   <v-card
                                        class="chat_bgc_game py-2"
                                   >
                                        <div
                                             class="d-flex white--text px-3 py-1 justify-space-between align-center"
                                             v-for="(teamB,i) in JSON.parse(gameObject.getTeamB())"
                                             :key="i"
                                        >
                                             <v-avatar
                                                  size="40"
                                             >
                                                  <v-img  :src="teamB.avatarfull     "/>
                                             </v-avatar>        
                                             <span>
                                                  {{ teamB.personaname.substring(0,21) }}
                                             </span>
                                        </div>
                                   </v-card>
                              </div>
                         </v-row>
                         <v-row>
                              <v-col
                                   class="d-flex justify-center pa-1 text-body-2"
                                   cols="12"
                              >
                                   <v-card
                                        class="bgc_little"
                                   >
                                        <span>Map : {{ gameObject.getMap() }} </span>
                                   </v-card>
                              </v-col>
                         </v-row>
                         <v-row>
                              <v-col
                                   class="d-flex justify-center pa-1 mb-8 text-body-2"
                                   cols="12"
                              >
                                   <v-card
                                        class="bgc_little_ip d-flex justify-space-around"
                                   >
                                        <span class="white-text">IP : {{ gameObject.getIp() }}</span>
                                        <a
                                             class="btn_join"
                                             :href="'steam://connect/' + gameObject.getIp()"
                                             @click="isGameStarted == !isGameStarted"
                                        >
                                             {{$t('join')}}
                                   </a>
                                   </v-card>
                              </v-col> 
                         </v-row>
                    </div>
               </v-card>
          </template>
     </v-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import QueueGamesItemModel from '@/models/Queues/QueueGamesItemModel';

export default defineComponent({
     name:'GameStarted',
     props:{
          isGameStarted:{
               type: Boolean
          },
          gameObject:{
               type: Object as PropType<QueueGamesItemModel|null>
          }
     },
     setup(){

          return{

          }
     }
})
</script>

<style> 
.chat_bgc_cards {
     background: rgba(17, 17, 23, 1) !important;
     border-color: #ef4242 !important;
     box-shadow: 0 0 10px #910000 !important;
     text-align: center; 
}

.chat_bgc_game {
     background: rgba(17, 17, 23, 0.5) !important;
     border-color: #ef4242 !important;
     box-shadow: 0 0 10px #910000 !important;
     min-width: 250px; 
}

.bgc_little {  
     background: rgba(17, 17, 23, 0.5) !important; 
     box-shadow: 0 0 10px #910000 !important;  
     min-width: 250px;
     max-width: 300px; 
     display: inline-flex;
     align-items: center;
     justify-content: center;
     color:white !important;
     font-weight: bold;
     height: 40px;  
}

.bgc_little_ip {
  background: rgba(17, 17, 23, 0.5) !important;
  border-color: #ef4242 !important;
  box-shadow: 0 0 10px #910000 !important; 
  min-width: 370px;  
  height: 40px; 
  align-items: center; 
  color:white !important;
  font-weight: bold;
}

.btn_join {
     padding: 5px;         
     margin: 2px; 
     text-decoration: none; 
     background-color: #910000 !important;
     color: #fff !important; 
}

</style>