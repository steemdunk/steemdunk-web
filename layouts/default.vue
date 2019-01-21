<template>
  <v-app>
    <v-toolbar dense fixed app>
      <v-toolbar-side-icon>
        <nuxt-link to="/">
          <img src="/steemdunk-logo.png" height="32">
        </nuxt-link>
      </v-toolbar-side-icon>
      <v-toolbar-title style="cursor: default;">Steemdunk</v-toolbar-title>
      <template v-if="loggedIn">
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-menu offset-y offset-x min-width="250px">
            <v-btn flat slot="activator">
              <v-layout>
                <div class="toolbar-text hidden-xs-only pr-3" style="text-transform: none;">Welcome, {{user.username}}!</div>
                <img :src="avatarUrl" height="32">
              </v-layout>
            </v-btn>
            <v-list>
              <v-list-tile avatar>
                <v-list-tile-avatar><img :src="avatarUrl" height="32"></v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Profile</v-list-tile-title>
                  <v-list-tile-sub-title>{{user.username}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-divider />
            <v-list>
              <v-list-tile @click="signOut">
                <v-list-tile-title>Sign out</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </template>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer fixed app>Steemdunk</v-footer>
  </v-app>
</template>

<style lang="stylus" scoped>
.toolbar-text {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.2em;
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { User } from '~/src/user';

  @Component
  export default class extends Vue {
    @Prop({ default: 'Steemdunk' })
    title: string;

    get loggedIn(): boolean {
      return this.user !== undefined;
    }

    get user(): User {
      return this.$store.state.user;
    }

    get avatarUrl(): string {
      return `https://steemitimages.com/u/${this.user.username}/avatar/medium`;
    }

    async signOut() {
      try {
        const user: User = this.$store.state.user;
        await this.$axios.post('/signout', undefined, {
          headers: {
            session: user.sessionToken
          }
        });
        this.$store.commit('reset');
      } catch (e) {
        console.error('Failed to sign out', e);
      }
    }
  }
</script>
