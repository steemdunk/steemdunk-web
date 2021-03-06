<template>
  <v-card>
    <v-card-title primary-title class="headline">Stats</v-card-title>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm3 md2>
          <v-layout>
            <span class="subheading">Voting power:</span>
          </v-layout>
          <v-layout style="padding-top: 10px;">
            <v-progress-circular size="100" width="12" color="green" :value="votingPower">
              <b>{{votingPower}}%</b>
            </v-progress-circular>
          </v-layout>
        </v-flex>
        <v-divider class="hidden-md-and-down" vertical />
        <div class="hidden-sm-and-up" style="padding-top: 150px;"></div>
        <v-flex xs8 style="margin-left: 10px; max-width: 13.5em;">
          <v-layout class="subheading" style="padding-bottom: 5px;">Plan:</v-layout>
          <v-layout>
            <v-layout>Current plan:</v-layout>
            <v-layout justify-end>{{plan}}</v-layout>
          </v-layout>
          <v-divider />
          <v-layout>
            <v-layout>Expires:</v-layout>
            <v-layout justify-end :class="{ 'red--text font-weight-bold': premiumExpired }">
              <span>{{expiry}}</span>
            </v-layout>
          </v-layout>
          <v-divider />
          <v-layout>
            <v-layout>Curating:</v-layout>
            <v-layout justify-end>{{curatingStat}}</v-layout>
          </v-layout>
            <v-btn color="info" to="/plan" small outline>Manage Plan</v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Getter } from 'nuxt-property-decorator';
import { Payment, Plan } from '~/src/common';
import { dateToString } from '~/src/util';
import { User } from '~/src/user';

@Component
export default class extends Vue {

  readonly Plan = Plan;

  @Getter
  premiumExpired: boolean;

  get user(): User {
    return this.$store.state.user;
  }

  get plan(): string {
    return Payment.planToString(this.user.premium.plan);
  }

  get expiry(): string {
    if (this.user.premium.plan == Plan.BRONZE) return 'Never';
    let str = dateToString(this.user.premium.expiry, false);
    if (this.premiumExpired) str += ' - Expired';
    return str;
  }

  get curatingStat(): string {
    const quota = Payment.getQuota(this.user.premium.plan);
    return `${this.$store.state.curations.curating.length}/${quota}`;
  }

  get votingPower(): number {
    return this.user.steem.votingPowerPercent;
  }
}
</script>
