<template>
  <v-layout column>
    <v-layout row>
      <v-flex xs8 md3>
        <v-layout class="pt-2 body-2">Voting Weight</v-layout>
        <v-layout class="caption">The strength of the vote you wish to cast</v-layout>
      </v-flex>
      <v-flex class="pr-3" style="max-width: 60px;">
        <v-text-field
          :rules="[rules.required, rules.voteWeight]"
          v-model="authorSettings.voteWeight"
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
      <v-flex class="pr-3" style="max-width: 60px;">
        <v-text-field
          :rules="[rules.required, rules.voteDelay]"
          v-model="authorSettings.voteDelay"
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
      <v-flex class="pr-3" style="max-width: 60px;">
        <v-text-field
          :rules="[rules.required, rules.maxDailyVotes]"
          v-model="authorSettings.maxDailyVotes"
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
          :min="0"
          :max="20"
          thumb-label
        ></v-slider>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import { Author } from '~/src/author';
import Vue from 'vue';

@Component
export default class extends Vue {

  readonly rules = {
    required: val => (val !== '' && val !== undefined) || 'Required.',
    voteWeight: val => (val >= 0 && val <= 100) || 'Out of range.',
    voteDelay: val => (val >= 0 && val <= 1440) || 'Out of range.',
    maxDailyVotes: val => (val >= 0 && val <= 20) || 'Out of range.'
  };

  @Prop()
  authorSettings: Author;
}
</script>
