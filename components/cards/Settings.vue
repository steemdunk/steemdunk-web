<template>
  <v-layout>
    <v-card width="100%">
      <v-card-title primary-title class="headline">Settings</v-card-title>
      <v-card-text>
        <v-layout column>
          <v-flex>
            <v-checkbox
              class="ma-0 pa-0"
              v-model="settings.botSupport"
              label="Allow Steemdunk to upvote your content (max once per day)"
            />
          </v-flex>
          <v-flex>
            <v-checkbox
              class="ma-0 pa-0"
              v-model="settings.claimRewards"
              label="Automatically claim rewards once every 24 hours"
            />
          </v-flex>
          <v-flex>
            <v-checkbox
              class="ma-0 pa-0"
              v-model="settings.globalVotePause"
              label="Pause All Votes"
            />
          </v-flex>
          <v-flex>
            <v-btn @click="save">Update</v-btn>
          </v-flex>
          <v-flex v-if="saveSuccess" class="pt-2 subheading font-weight-bold success--text">
            <span>Settings saved</span>
          </v-flex>
          <v-flex v-if="saveError" class="pt-2 subheading font-weight-bold error--text">
            <span>{{saveError}}</span>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import { User, Settings } from '~/src/user';
import Vue from 'vue';

@Component
export default class extends Vue {

  settings: Settings;

  saveSuccess: boolean = false;
  saveError: string|null = null;

  created() {
    const user: User = this.$store.state.user;
    this.settings = Object.assign({}, user.settings);
  }

  async save() {
    this.saveSuccess = false;
    this.saveError = null;
    const settings = Object.assign({}, this.settings);
    try {
      await this.$sendApiReq({
        api: 'update_settings',
        params: settings
      });
      this.$store.commit('userSettings', settings);
      this.saveSuccess = true;
      setTimeout(() => {
        this.saveSuccess = false;
      }, 5000);
    } catch (e) {
      console.log('Error updating settings', settings);
      this.saveError = 'Error updating settings: ' + e.message;
    }
  }
}
</script>
