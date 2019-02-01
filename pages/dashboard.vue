<template>
  <div v-if="loggedIn">
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
import Settings from '~/components/cards/Settings.vue';
import VoteLog from '~/components/cards/VoteLog.vue';
import Curating from '~/components/cards/Curating';
import Stats from '~/components/cards/Stats.vue';
import { User } from '~/src/user';

@Component({
  components: {
    Stats,
    Settings,
    Curating,
    VoteLog
  }
})
export default class extends Vue {

  fetch({ store, redirect }) {
    if (store.state.user === undefined) {
      redirect('/');
    }
  }

  get loggedIn(): boolean {
    return this.user !== undefined;
  }

  get user(): User {
    return this.$store.state.user;
  }
}
</script>
