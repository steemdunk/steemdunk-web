<template>
  <v-layout column>
    <v-layout row>
      <v-flex xs8 md3>
        <v-layout class="pt-2 body-2">Voting Weight</v-layout>
        <v-layout class="caption">The strength of the vote you wish to cast</v-layout>
      </v-flex>
      <v-flex class="pl-2 pr-3" style="max-width: 65px;">
        <v-text-field
          :rules="[rules.required, rules.voteWeight]"
          v-model="authorSettings.voteWeight"
          :disabled="saving === SaveState.SAVING"
          class="mt-0"
          hide-details
          single-line
          min=1
          max=100
          type="number"
        ></v-text-field>
      </v-flex>
      <v-flex class="hidden-xs-only">
        <v-slider
          v-model="authorSettings.voteWeight"
          :disabled="saving === SaveState.SAVING"
          :min="1"
          :max="100"
          thumb-label
          always-dirty
        ></v-slider>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs8 md3>
        <v-layout class="pt-2 body-2">Voting Delay</v-layout>
        <v-layout class="caption">In minutes, ranges from 0 to 1440</v-layout>
      </v-flex>
      <v-flex class="pl-2 pr-3" style="max-width: 65px;">
        <v-text-field
          :rules="[rules.required, rules.voteDelay]"
          v-model="authorSettings.voteDelay"
          :disabled="saving === SaveState.SAVING"
          class="mt-0"
          hide-details
          single-line
          min=0
          max=1440
          type="number"
        ></v-text-field>
      </v-flex>
      <v-flex class="hidden-xs-only">
        <v-slider
          v-model="authorSettings.voteDelay"
          :disabled="saving === SaveState.SAVING"
          :min="0"
          :max="1440"
          thumb-label
          always-dirty
        ></v-slider>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs8 md3>
        <v-layout class="pt-2 body-2">Max Daily Votes</v-layout>
        <v-layout class="caption">Maximum daily votes in a 24-hour window</v-layout>
      </v-flex>
      <v-flex class="pl-2 pr-3" style="max-width: 65px;">
        <v-text-field
          :rules="[rules.required, rules.maxDailyVotes]"
          v-model="authorSettings.maxDailyVotes"
          :disabled="saving === SaveState.SAVING"
          class="mt-0"
          hide-details
          single-line
          min=0
          max=20
          type="number"
        ></v-text-field>
      </v-flex>
      <v-flex class="hidden-xs-only">
        <v-slider
          v-model="authorSettings.maxDailyVotes"
          :disabled="saving === SaveState.SAVING"
          :min="0"
          :max="20"
          thumb-label
        ></v-slider>
      </v-flex>
    </v-layout>

    <v-layout class="pt-2">
      <v-btn @click="save" color="info">Save</v-btn>
      <v-btn @click="remove" color="error">Remove</v-btn>
    </v-layout>

    <v-layout>
      <v-flex v-if="saveError" class="pt-2 subheading font-weight-bold error--text">
        {{saveError}}
      </v-flex>
      <v-flex v-if="saving === SaveState.COMPLETE" class="pt-2 subheading font-weight-bold success--text">
        <span>Settings saved</span>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import { Author } from '~/src/author';
import Vue from 'vue';

export enum SaveState {
  NONE,
  COMPLETE,
  SAVING,
  ERROR
}

@Component
export default class extends Vue {

  readonly SaveState = SaveState;

  readonly rules = {
    required: val => (val !== '' && val !== undefined) || 'Required.',
    voteWeight: val => (val >= 0 && val <= 100) || 'Out of range.',
    voteDelay: val => (val >= 0 && val <= 1440) || 'Out of range.',
    maxDailyVotes: val => (val >= 0 && val <= 20) || 'Out of range.'
  };

  @Prop()
  authorSettings: Author;

  savingFlag: SaveState = SaveState.NONE;
  saveError: string|null = null;

  set saving(state) {
    this.savingFlag = state;
    this.$emit('saving', state);
  }

  get saving() {
    return this.savingFlag;
  };

  @Watch('authorSettings', { deep: true })
  authorSettingsUpdated() {
    this.saving = SaveState.NONE;
    this.saveError = null;
  }

  async save() {
    this.saving = SaveState.SAVING;
    this.saveError = null;

    const author = Object.assign({}, this.authorSettings);
    try {
      await this.$sendApiReq({
        api: 'update_author',
        params: author
      });
      this.saving = SaveState.COMPLETE;
    } catch (e) {
      this.saveError = e.message;
      this.saving = SaveState.ERROR;
      console.log('Saving author error', author, e);
    }
  }

  async remove() {
    this.saving = SaveState.SAVING;
    this.saveError = null;

    const author = this.authorSettings.author;
    try {
      await this.$sendApiReq({
        api: 'remove_author',
        params: { author }
      });
      this.saving = SaveState.NONE;
      this.$store.commit('rmCuration', author);
      this.$emit('author-removed');
    } catch (e) {
      this.saveError = e.message;
      this.saving = SaveState.ERROR;
      console.log('Error removing author', author, e);
    }
  }
}
</script>
