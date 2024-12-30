<template>
     <v-menu style="top: -12px" offset-x>
          <template v-slot:activator="{ on, attrs }">
               <td v-bind="attrs" v-on="on" class="px-0">
                    <v-icon color="grey">mdi-delete
                    </v-icon>
               </td>
          </template>
          <v-card color="grey">
               <v-card-title class="text-subtitle-2">¿Deseas borrar el mensaje de
                    {{ userName }}?
               </v-card-title>
               <v-card-text class="d-flex justify-space-around">
                    <v-btn color="success" @click.prevent="$emit('delete-message', messageId)">
                         Si
                    </v-btn>
                    <v-btn color="red">
                         no
                    </v-btn>
               </v-card-text>
          </v-card>
     </v-menu>
</template>
<script>
import { defineComponent} from "@vue/composition-api";

export default defineComponent({
     name : 'DeleteMenu',
     props:{
          userName : {
               type : String
          },
          messageId : {
               type : Number
          }
     }

})
</script>
<style>

</style>