<template>
	<!-- <v-container>
          <v-row>
               <v-col
                    cols="12"
                    class="text-center"
               > 
                         <div class="d-flex justify-center">
                              <v-img 
                                   max-width="250px" 
                                   src="@/assets/prime/PRIME_main.png"
                              >
                              </v-img>
                         </div>
                         <div>
                              <v-card-title class="white--text justify-center text-h5 font-weight-bold">
                                   Bienvenido a 4SAKEN PRIME
                              </v-card-title>
                              <v-card-text class="white--text">
                                   <span>4saken Prime es una suscripción que te ofrece beneficios extra tanto in-game como en la
                                        página web,
                                        por un precio módico y que puedes cancelar cuando tu quieras. Se aplican términos y
                                        condiciones.
                                   </span>
                              </v-card-text>
                              <v-card-title class="white--text justify-center text-h5 font-weight-bold">
                                   ¿Por qué cambiarse a PRIME?
                              </v-card-title>
                              <v-card-text class="white--text">
                                   Los beneficios que te brinda 4SAKEN Prime son:
                              </v-card-text>
                         </div>  
               </v-col>
          </v-row>
          <v-row>
               <v-col
                    cols="12"
                    class="d-flex justify-center"
               > 
                    <v-card 
                         class="premium_types"
                         width="70%"
                    >
                         <v-row>
                              <v-col
                                   md="3"
                                   cols="12"
                                   class="d-flex align-center justify-center"
                              >
                                   <v-img 
                                        src="@/assets/prime/PRIME_web.png" 
                                        max-width="200px"
                                   > 
                                   </v-img>
                              </v-col>
                              <v-col
                                   md="9"
                                   cols="12"
                                   class="d-flex align-center"
                              > 
                                   <v-card-text class="white--text">
                                        <ul>
                                             <li>
                                                  Insignia Prime junto al nickname
                                             </li>
                                             <li>
                                                  Color y Brillo para el nickname, mensajes y foto de perfil
                                             </li>
                                             <li>
                                                  Podrás ver con quién te estás emparejando
                                             </li>
                                             <li>
                                                  Re-roll para elección del nuevo mapa
                                             </li>
                                             <li>
                                                  Reducción de penalización por abandono
                                             </li>
                                        </ul>
                                   </v-card-text>
                              </v-col>
                         </v-row> 
                    </v-card>
               </v-col>
               <v-col
                    cols="12"
                    class="d-flex justify-center"
               > 
                    <v-card 
                         class="premium_types"
                         width="70%"
                    >
                         <v-row>
                              <v-col
                                   md="3"
                                   cols="12"
                                   class="d-flex align-center justify-center"
                              >
                                   <v-img 
                                        src="@/assets/prime/PRIME_ingame.png"
                                        max-width="200px"
                                   > 
                                   </v-img>
                              </v-col>
                              <v-col
                                   md="9"
                                   cols="12"
                                   class="d-flex align-center"
                              > 
                                   <v-card-text class="white--text">
                                        <ul>
                                             <li>
                                                  Acceso a los emotes, bailes y sombreros.
                                             </li>
                                             <li>
                                                  Skins exclusivos para supervivientes.
                                             </li>
                                             <li>
                                                  Local GAG: Te permite silenciar ( Chat de voz y texto) a otros jugadores.
                                             </li>
                                             <li>
                                                  IN-GAME Ping: Te permite "Marcar" lugares en el mapa
                                             </li>
                                        </ul>
                                   </v-card-text>
                              </v-col>
                         </v-row> 
                    </v-card>
               </v-col>
               <v-col
                    cols="12"
                    class="d-flex justify-center"
               > 
                    <v-card 
                         class="premium_types"
                         width="70%"
                    >
                         <v-row>
                              <v-col
                                   md="3"
                                   cols="12"
                                   class="d-flex align-center justify-center"
                              >
                                   <v-img 
                                        src="@/assets/prime/PRIME_discord.png"
                                        max-width="200px"
                                   > 
                                   </v-img>
                              </v-col>
                              <v-col
                                   md="9"
                                   cols="12"
                                   class="d-flex align-center"
                              > 
                                   <v-card-text class="white--text">
                                        <ul>
                                             <li>
                                                  Rol en el servidor de Discord.
                                             </li>
                                             <li>
                                                  Atención prioritaria y personalizada por parte del Staff.
                                             </li>
                                             <li>
                                                  Acceso a canales ocultos de voz y texto
                                             </li>
                                        </ul>
                                   </v-card-text>
                              </v-col>
                         </v-row> 
                    </v-card>
               </v-col>
          </v-row>
          <v-row>
               <v-col
                    cols="12"
               > 
                         <v-card-title class="white--text text-h4 justify-center font-weight-bold">
                              Elige tu plan PRIME
                         </v-card-title>
                         <v-card-text class="white--text text-center">
                              <p>Disfruta de todos los beneficios. Cancela en cualquier momento.</p>
                         </v-card-text>  
               </v-col>
          </v-row>
          <v-row>
               <v-col
                    md="4"
                    cols="12"
                    class="d-flex justify-center"
               >
                    <v-card 
                         class="premium_prices white--text"
                    >
                         <div class="div_content">
                              <p class="text-h4 font-weight-bold">Mensual</p>
                              <p class="text-body font-weight-bold">$2.99/año</p>
                         </div>
                         <v-card-actions class="align-end justify-center pa-0">
                              <v-btn 
                                   class="premium_button_gift"
                                   @click="buyPrime(2.99, 1, true)"
                              >
                                   <v-icon small >mdi-gift</v-icon>
                              </v-btn> 
                              <v-btn 
                                   class="premium_button" 
                                   @click="buyPrime(2.99, 1, false)"
                              >
                                   Suscribirse
                              </v-btn>
                         </v-card-actions>
                    </v-card>
               </v-col>
               <v-col
                    md="4"
                    cols="12" 
                    class="d-flex justify-center"
               >
                    <v-card class="premium_prices white--text">
                         <div class="div_content">
                              <small class="premium_month">
                                   2 meses gratis
                              </small>
                              <p class="text-h4 font-weight-bold">Anual</p>
                              <p class="text-body font-weight-bold">45% de descuento</p>
                              <p class="text-body font-weight-bold">$19.99/año</p>
                              <small>$1,67 al mes</small>
                         </div>
                         <v-card-actions class="align-end justify-center pa-0">
                              <v-btn 
                                   class="premium_button"
                                   @click="buyPrime(19.99, 14, false)"
                              >
                                   SUSCRIBIRSE
                              </v-btn>
                         </v-card-actions>
                    </v-card>
               </v-col>
               <v-col
                    md="4"
                    cols="12" 
                    class="d-flex justify-center"
               >
                    <v-card 
                         class="premium_prices white--text"
                    >
                         <div class="div_content">
                              <small class="premium_month">
                                   1 mes gratis
                              </small>
                              <p class="text-h4 font-weight-bold">Trimestral</p>
                              <p class="text-body font-weight-bold">17% de descuento</p>
                              <p class="text-body font-weight-bold">$14.99/año</p>
                              <small>$1,04 al mes</small>
                         </div>
                         <v-card-actions class="align-end justify-center pa-0">
                              <v-btn 
                                   class="premium_button"
                                   @click="buyPrime(14.99, 4, false)"
                              >
                                   SUSCRIBIRSE
                              </v-btn>
                         </v-card-actions>
                    </v-card>
               </v-col>
          </v-row>
          <v-dialog
               v-model="openDialog" 
               open-delay="2000"
               max-width="700"
               retain-focus 
               dark
               content-class="premium_dialog"
          >
               <v-card
                    class="premium_dialog"
               >
                    <v-card-title class="text-h4"> 
                         Detalle del Pedido
                    </v-card-title>
                    <v-card-text>
                         <p class="text-h6 font-weight-bold">Monto a pagar: ${{ amountMonth }} | S/.{{ amountMonthSoles }}</p>
                         <p class="text-h6 font-weight-bold">Duración: {{ durationPremium }} {{getMonth}}</p>
                    </v-card-text>

                    <v-card-actions
                         class="d-flex justify-center pa-5"
                         style="gap: 15px;"
                    >
                         <v-btn 
                              @click="selectPayment = 1"
                              text
                              plain
                              :retain-focus-on-click="true"
                         >
                              <v-avatar
                                   tile
                              >
                                   <v-img
                                        src="@/assets/payment_methods/paypal.png"
                                   ></v-img>
                              </v-avatar>
                         </v-btn>
                         <v-btn 
                              @click="selectPayment = 2"
                              text
                              plain
                              retain-focus-on-click
                         >
                              <v-avatar
                                   tile
                              >
                                   <v-img
                                        src="@/assets/payment_methods/yape.png"
                                   ></v-img>
                              </v-avatar>
                         </v-btn>
                         <v-btn 
                              @click="selectPayment = 3"
                              text
                              plain
                              retain-focus-on-click
                         >
                              <v-avatar
                                   tile
                              >
                                   <v-img
                                        src="@/assets/payment_methods/plin.png"
                                   ></v-img>
                              </v-avatar>
                         </v-btn>
                    </v-card-actions>
                    <v-card-text
                         v-if="selectPayment == 1"
                    >
                         Paypal
                    </v-card-text>
                    <v-card-text
                         v-if="selectPayment == 2"
                    >
                         Yape
                    </v-card-text>
                    <v-card-text
                         v-if="selectPayment == 3"
                    >
                         Plin
                    </v-card-text>
               </v-card>
          </v-dialog>
     </v-container> -->
</template>
<script lang="ts">
/* import { defineComponent, ref, computed, onMounted } from "vue";

import axios from 'axios'

export default defineComponent({
     name: 'PrimeView',
     setup() {

          const amountMonth = ref<number>(0)
          const durationPremium = ref<number>(0)

          const precioSoles = ref<number>(0)

          let openDialog = ref<boolean>(false)
          let selectPayment = ref<number>(0)

          const getMonth = computed( () => durationPremium.value > 1 ? 'meses' : 'mes')

          const amountMonthSoles = ref<number|string>(0)

          const getSolesAPI = async () =>{
               
               const { data } = await axios.get('login/get/exchange')
               precioSoles.value =  data.venta;  
          }

          const buyPrime = async (amount : number, duration: number, gift : boolean) => {
               
               openDialog.value = true;
               
               amountMonth.value = amount

               amountMonthSoles.value = (precioSoles.value * amount).toFixed(2);
               
               durationPremium.value = duration;

          }

          onMounted ( () =>{
               getSolesAPI()
          })

          return {
               buyPrime,
               openDialog,
               getMonth,
               amountMonth,
               durationPremium,
               amountMonthSoles,
               selectPayment
          }
     }
}) */
</script>
<style>
.premium_types {
	display: flex;
	align-items: center;
	background: rgba(17, 17, 23, 0.5) !important;
	box-shadow: 0 0 10px #910000 !important;
	text-align: center;
}
.premium_prices {
	display: grid;
	padding: 15px;
	background: rgba(17, 17, 23, 0.5) !important;
	box-shadow: 0 0 10px #910000 !important;
	min-width: 400px;
	min-height: 275px;
}
.premium_button {
	border-radius: 10px;
	background-color: #6d0808 !important;
	color: #fff !important;
}
.premium_button_gift {
	border-radius: 10px;
	background-color: #6d0808 !important;
	color: #fff !important;
}
.premium_month {
	position: absolute;
	justify-content: right;
	border-radius: 10px;
	background-color: #910000 !important;
	text-decoration: none;
	padding: 6px !important;
}
.div_content {
	display: grid;
	align-content: center;
	line-height: 0.6;
}

.premium_dialog {
	background: rgba(17, 17, 23, 0.8) !important;
	border-color: #ef4242 !important;
	box-shadow: 0 0 10px #910000 !important;
	min-width: 250px;
}
</style>
