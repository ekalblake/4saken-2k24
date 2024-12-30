<template>
     <v-container fluid>
          <v-row 
               class="d-flex justify-center align-content-center"
          >
               <v-img 
                    src="@/assets/aboutus.png" 
                    max-height="100%" 
                    max-width="310" 
               />
               <v-col 
                    md="12" 
                    cols="12" 
                    class="white--text pa-5 text-center"
               >
                    <v-card-text class="font-weight-bold">
                         <p>
                              <strong class="rojo">4SAKEN.US</strong> {{ $t('about_1') }}
                              <strong class="rojo">Left 4 Dead 2</strong> {{ $t('about_2') }}
                              <br>{{ $t('about_3') }}
                         </p>
                         <p>
                              {{ $t('about_4') }}<strong class="rojo">{{ $t('about_4_1') }}</strong>{{ $t('about_5') }}
                              <strong class="rojo">'Unranked'</strong> {{ $t('about_6') }}
                              <br>{{ $t('about_7') }}
                              <br>{{ $t('about_8') }}
                         </p>
                         <p>
                              {{ $t('about_9') }}<br> {{ $t('about_10') }} <a class="rojo"
                                   href="https://discord.gg/MhKvK9r75r" target="_blank">Discord</a> {{ $t('about_11') }}
                         </p>
                         <p>
                              {{ $t('about_12') }} <br> {{ $t('about_13') }}
                         </p>
                         <p>
                              {{ $t('about_14') }} <strong class="rojo">4SAKEN.US</strong> {{ $t('about_15') }}
                         </p>
                         <p>
                              {{ $t('about_16') }}
                         </p>
                         <p>
                              <strong class="rojo">- Team 4SAKEN.US</strong>
                         </p>
                    </v-card-text>
               </v-col>
          </v-row>
     </v-container>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
     name: "AboutView",
     setup() {
          return {

          }
     },
});

</script>
<style scoped>
.rojo {
     color: #a70303 !important;
}
</style>