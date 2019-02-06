<template>
  <div v-if="loggedIn">
    <v-container class="pb-0">
      <v-alert :value="premiumExpired" type="error">
        <span>Your premium plan has expired, certain functions may be </span>
        <span>disabled.</span>
      </v-alert>
    </v-container>
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
import { Vue, Component, Getter } from 'nuxt-property-decorator';
import Settings from '~/components/cards/Settings.vue';
import VoteLog from '~/components/cards/VoteLog.vue';
import Curating from '~/components/cards/Curating';
import Stats from '~/components/cards/Stats.vue';

@Component({
  components: {
    Stats,
    Settings,
    Curating,
    VoteLog
  }
})
export default class extends Vue {

  @Getter
  loggedIn: boolean;

  @Getter
  premiumExpired: boolean;

  fetch({ store, redirect }) {
    if (!store.getters.loggedIn) {
      redirect('/');
    }
  }
}
</script>
