<template>
	<v-container class="d-flex justify-center align-center">
		<v-img max-height="100%" max-width="750px" src="@/assets/comingsoon.png"> </v-img>
		<!--<h1 class="partner_title pa-5" >
      PARTNERS
    </h1>
    <v-row>
      <v-col
          md="8"
          cols="12"
      >
        <v-card class="bgc1 overflow-auto ">

          <v-card class="singular">
            <p class="white--text pa-2">Lorem ipsum dolor sit amet. Aut ullam magnam ut suscipit voluptatem sit delectus minima id voluptatem dolorem vel facere galisum et quas officia ab veniam doloremque. Et deleniti quia eos provident esse et internos natus qui laboriosam laboriosam aut quisquam provident aut galisum accusamus. Ad doloremque maxime vel voluptatem natus est nulla voluptate et officiis veniam.
              Eum consequatur rerum est omnis error aut exercitationem eveniet aut tempora iste nam commodi amet. Non sapiente voluptate aut ipsam vitae et molestiae impedit! Eos quidem nobis ab facere adipisci non laborum voluptate sed ullam temporibus quo amet molestiae sit voluptatum nostrum? Aut consectetur itaque in doloribus nemo in eaque voluptas omnis quis aut maiores consectetur et vitae consequatur et temporibus molestiae.
              Et delectus voluptatem qui quam ipsam non enim consectetur id voluptates dolorum qui nobis galisum est tenetur delectus. Id sint numquam et quasi veniam hic dolores incidunt ex velit dolores qui voluptatem optio! Aut minus optio At debitis laborum ea architecto voluptatem ut rerum quia qui maxime?
            </p>
            <v-card-title>Partners oficiales de 4saken.us:</v-card-title>

            <div v-if="adminList">
              <v-row>
                <v-col
                    xl="2"
                    lg="2"
                    md="4"
                    sm="6"
                    cols="12"
                    v-for="(admin,i) in adminList.getAdmins()"
                    :key="i"
                >
                  <v-card
                      class="bgc1 py-2  mx-auto"
                      max-width="344"
                      max-height="250px"

                  >
                    <a :href="admin.getProfileUrl()">
                      <v-img
                          :src="admin.getAvatarFull()"
                          height="150px"
                          class="ma-1 "
                      ></v-img>
                    </a>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                            v-bind="attrs"
                            v-on="on"
                        >
                          <v-card-title class="justify-center white--text">
                                  {{admin.getPersonaname()}}
                          </v-card-title>
                        </span>
                      </template>
                      <v-card-text
                          v-if="admin.getPersonaState() == 'Desconectado'"
                          class="justify-center"
                      >
                      <span class="red--text">
                      {{admin.getPersonaState()}}
                      </span>
                        <v-divider></v-divider>
                        Última conexión: {{(admin.getPersonaState() == 'En linea' ? '' : admin.getLastLogOff())}}
                      </v-card-text>
                      <v-card-text
                          v-else
                          class="justify-center"
                      >
                      <span class="green--text font-weight-bold">
                      {{admin.getPersonaState()}}
                      </span>
                      </v-card-text>
                    </v-tooltip>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            <div v-else>
              <v-container>
                <v-row>
                  <v-col
                      v-for="(n,i) in 8"
                      :key="i"
                      cols="12"
                      md="3"
                  >
                    <v-skeleton-loader
                        type="card-avatar"
                    ></v-skeleton-loader>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-card>
        </v-card>
      </v-col>
      <v-col
          md="4"
          cols="12"
      >
        <v-card class="bgc2">
          <v-card class="singular">
            <v-sheet color="grey" height="300px"></v-sheet>
            <v-card-text class="white--text">Trailer 4saken.us</v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>-->
	</v-container>
</template>
<script lang="ts"></script>
<style scoped>
.bgc1 {
	background: rgba(56, 52, 52, 0.3) !important;
	justify-content: center;
	align-items: center;
	height: 100vh;
	border-color: #ef4242;
	box-shadow: 0 0 10px #c20606;
}
.bgc2 {
	background: rgba(56, 52, 52, 0.3) !important;
	justify-content: center;
	align-items: center;
	height: 100vh;
}
.singular {
	background: rgba(17, 17, 23, 0.5) !important;
	font-size: 20px;
	color: white !important;
	outline: none;
	border-color: #ef4242 !important;
	box-shadow: 0 0 10px #c20606 !important;
	padding: 10px;
	margin: 10px;
}

.partner_title {
	text-transform: uppercase;
	color: #a82424;
	font-weight: 500;
}
</style>
