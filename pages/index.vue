<template>
  <v-container>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm8 md4>
        <v-img src="/steemdunk-logo.png" aspect-ratio="1" max-width=300></v-img>
      </v-flex>
      <v-flex xs12 sm5 md8>
        <v-layout row wrap class="description">
          <div>
            <v-icon>thumb_up</v-icon><b>Steemdunk is a curation platform, without the <i>hassle</i>.</b>
            <span>Votes take place at any scheduled time when your favorite </span>
            <span>author creates an article. This maximizes curation rewards, </span>
            <span>or if you're feeling generous, you can give your favorite author </span>
            <span>a boost by instantly voting on their article.</span>
          </div>
          <div>
            <v-icon>toc</v-icon><b>Flexible and cost effective.</b>
            <span>We offer multiple plans depending on how many authors you want </span>
            <span>to curate. The free plan is entirely free to use.</span>
            <nuxt-link to="/plan">View the details here</nuxt-link>
          </div>
          <div>
            <v-icon>flash_on</v-icon><b>Fast and secure.</b>
            <span>We use SteemConnect to handle your logins. This means you don't </span>
            <span>hand over private keys or setup new passwords. Getting started </span>
            <span>on Steemdunk is a snap!</span>
          </div>
          <div>
            <v-icon>keyboard</v-icon><b>Completely open.</b>
            <span>The source code is hosted completely on GitHub. Anyone can </span>
            <span>report bugs or contribute to the platform, helping the platform </span>
            <span>become better for the whole. </span><a href="https://github.com/steemdunk" target="_blank">Get started here</a>
          </div>
          <div>
            <v-icon>people</v-icon><b>Join the community.</b>
            <span>You can find us on Discord should you want to join the </span>
            <span>community or need support. </span><a href="https://discord.gg/hT7gw4B" target="_blank">Join here</a>
          </div>
          <div>
            <v-btn color="primary" :href="loginUrl"><v-icon>exit_to_app</v-icon>Sign in</v-btn>
            <b style="font-style: oblique;">- or -</b>
            <v-btn color="primary" :href="loginUrl"><v-icon>arrow_upward</v-icon>Sign up</v-btn>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="stylus" scoped>
.description {
  font-size: 1.1em;

  & > div {
    padding-top: 15px;

    b {
      font-size: 1.15em;
    }
    .v-icon {
      padding-right: 8px;
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class extends Vue {

  fetch({ store, redirect }) {
    if (store.getters.loggedIn) {
      redirect('/dashboard');
    }
  }

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
}
</script>
