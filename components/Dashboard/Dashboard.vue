<template>
  <div>
    <v-container>
      <Stats />
    </v-container>
    <v-container>
      <Settings />
    </v-container>
    <v-container>
      <Curating />
    </v-container>
    <v-container>
      <VoteLog />
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Settings from './cards/Settings.vue';
import VoteLog from './cards/VoteLog.vue';
import Curating from './cards/Curating';
import Stats from './cards/Stats.vue';

@Component({
  components: {
    Stats,
    Settings,
    Curating,
    VoteLog
  }
})
export default class extends Vue {
}
</script>
