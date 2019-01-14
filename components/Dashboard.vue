<template>
  <v-layout row wrap>
    <v-container>
      <Stats />
    </v-container>
    <v-container>
      <Curating />
    </v-container>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Curating from './cards/Curating.vue';
import Stats from './cards/Stats.vue';

@Component({
  components: {
    Stats,
    Curating
  }
})
export default class extends Vue {
}
</script>
