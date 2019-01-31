<template>
  <div v-if="loggedIn">
    <Dashboard />
  </div>
  <div v-else>
    <Landing :loginUrl=loginUrl />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
const Dashboard = () => import('~/components/Dashboard');
const Landing = () => import('~/components/Landing.vue');

@Component({
  components: { Landing, Dashboard }
})
export default class extends Vue {

  get loginUrl(): string {
    const host = process.env.SC_HOST!;
    const redirectUri = process.env.SC_REDIRECT_URI!;
    const broadcastAccount = process.env.SC_BROADCAST_ACCOUNT!;

    const auth = `${host}/oauth2/authorize`;
    const url = encodeURIComponent(redirectUri);
    const redirect = `redirect_uri=${url}`;

    const response = 'response_type=code';
    const clientId = `client_id=${encodeURIComponent(broadcastAccount)}`;
    const scope = `scope=${encodeURIComponent(['offline', 'vote'].join(','))}`;

    return `${auth}?${clientId}&${response}&${redirect}&${scope}`;
  }

  get loggedIn(): boolean {
    return this.$store.state.user !== undefined;
  }
}
</script>
