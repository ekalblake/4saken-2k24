<template>
  <v-container
      fluid
      class="white--text"
  >
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
      <v-row>
        <v-col
            class="hidden-sm-and-down"
            cols="12"
            md="5"
        >

        </v-col>
        <v-col
            class="hidden-sm-and-down"
            cols="12"
            md="2"
        >
          <v-text-field
              dark
              v-model="serverIP"
              :rules="[
                        v => !!v || 'IP es requerido',
                        ]"
              label="IP"
              required
          ></v-text-field>
        </v-col>
        <v-col
            cols="12"
            md="1"
        >
          <v-text-field
              dark
              v-model="serverPort"
              :counter="5"
              :rules="[
                        v => !!v || 'PORT es requerido',
                        v => (v && v.length <= 5) || 'Menor de 6 digitos.'
                        ]"
              label="PORT"
              required
          ></v-text-field>
        </v-col
        >
        <v-col
            cols="12"
            md="3">
          <v-text-field
              dark
              v-model="serverName"
              :counter="25"
              :rules="[
                        v => !!v || 'Nombre es requerido',
                        v => (v && v.length <= 25) || 'Menor de 25 digitos.'
                      ]"
              label="Server name"
              required
          ></v-text-field>
        </v-col>
        <v-col
            cols="12"
            md="1">
          <v-btn
              class="d-flex align-center align-content-center justify-center "
              fab
              dark
              color="error"
              :disabled="!valid"
              @click.stop.prevent="addServer"
          >
            <v-icon dark>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <div v-if="!serverList"></div>
    <v-row
        v-else
    >
      <v-col
          cols="12"
          md="3"
          sm="4"
          v-for="(server,i) in serverList.getServerArray()"
          :key="i"
      >
        <v-card
            class="bgc_cards pa-2"
        >
          <v-row>
            <v-col
                cols="9"
                md="9"
            >
              <h4 class="d-flex justify-center white--text">{{ server.getExtra() }}:</h4>
              <h6 class="white--text">{{server.getIp()}}:{{server.getPort()}}</h6>
            </v-col>
            <v-col
                cols="3"
                md="3"
                style="align-self: center !important;"
            >
              <v-btn
                  class="d-flex align-content-center align-center align-self-auto"
                  fab
                  small
                  dark
                  color="indigo"
                  @click.once="removeServer(server.getServerId())"
              >
                <v-icon dark>
                  mdi-minus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, SetupContext} from "vue";
import { adminService} from "@/services/Admin/AdminService";
import ServerModel from "@/models/Admin/ServerModel";
import ServerItemModel from "@/models/Admin/ServerItemModel";


export default defineComponent({
  name: "serverList",

  setup(_,context : SetupContext) {

    let serverList: Ref<ServerModel | null> = ref(null)
    let valid: Ref<boolean> = ref(false);
    let serverIP: Ref<string> = ref('');
    let serverName: Ref<string> = ref('');
    let serverPort : Ref<number> =ref(0);

    const getServerList = async () => {
      const responseServer = await adminService.getServerList()
      serverList.value = new ServerModel(responseServer)
    }

    const addServer = async () => {
      //@ts-ignore
      context.refs.form.validate();

      let addServer = await adminService.newServer(serverIP.value, serverName.value, serverPort.value);
      if(addServer){
        console.log("AGREGO EL SV");
        serverList.value?.getServerArray().push(new ServerItemModel({
          ip: serverIP.value,
          extra : serverName.value,
          port : serverPort.value
        }))

       //@ts-ignore
       context.refs.form.reset();

      }

    }

    const removeServer = async (index : number) =>{

      let removeServer = await adminService.deleteServer(index);

      if(removeServer){
        let removeIndex = serverList.value?.getServerArray().map((item: ServerItemModel) => {
          return item.getServerId();
        }).indexOf(index);
        serverList.value?.getServerArray().splice(removeIndex,1)
      }
    }

    onMounted(() => {
      getServerList()
    })
    return {
      serverList,
      valid,
      serverIP,
      serverName,
      serverPort,
      removeServer,
      addServer
    }
  }
})
</script>

<style scoped>
.bgc_cards {
  background: rgba(17, 17, 23, 0.5) !important;
  border-color: #ef4242 !important;
  box-shadow: 0 0 10px #910000 !important;
  min-width: 250px
}
</style>