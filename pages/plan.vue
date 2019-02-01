<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title primary-title class="headline">Payment Plans</v-card-title>
        <v-card-text>
          <v-layout row wrap justify-center>
            <v-flex xs8 sm4 md4 v-for="(plan, i) in plans" :key="i">
              <v-sheet class="pa-3 ma-2" elevation="3">
                <v-layout column>
                  <v-layout justify-center>
                    <strong class="title">{{plan.name}}</strong>
                  </v-layout>
                  <v-divider class="my-2" />
                  <div>
                    <v-layout class="font-weight-medium subheading" justify-center>{{plan.annualPrice}}</v-layout>
                    <v-layout justify-center>{{plan.monthlyPrice}}</v-layout>
                  </div>
                  <v-divider class="my-2" />
                  <div>
                    <v-layout class="subheading" justify-center>
                      <span>Curate {{plan.curationQuota}} authors</span>
                    </v-layout>
                  </div>
                </v-layout>
              </v-sheet>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title primary-title class="headline">
          <span v-if="loggedIn">Account Status</span>
          <span v-else>Welcome, guest!</span>
        </v-card-title>
        <v-card-text>
          <div style="font-size: 1.2em;">
            <div v-if="loggedIn">
              <v-layout row wrap>
                <v-flex xs10 sm5 md4 lg3>
                  <v-layout>
                    <v-layout>Current plan:</v-layout>
                    <v-layout justify-end>{{currentPlan}}</v-layout>
                  </v-layout>
                  <v-layout>
                    <v-divider class="my-2" />
                  </v-layout>
                  <v-layout>
                    <v-layout>Expires:</v-layout>
                    <v-layout justify-end>{{currentPlanExpiry}}</v-layout>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>
            <div v-else>
              <span>Sign up on the <nuxt-link to="/">homepage</nuxt-link> and </span>
              <span>come back after deciding which plan works best for you. </span>
              <span>If you are already a member of Steemdunk, please sign </span>
              <span>in to upgrade or renew.</span>
            </div>
            <div class="pt-3">
              <v-icon>warning</v-icon>
              <span>Have issues or questions? </span>
              <span>
                <a target="_blank" href="https://discord.gg/hT7gw4B">Join us on Discord</a>
              </span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, State, Getter } from 'nuxt-property-decorator';
import { Plan, PlanPrice, CurationQuota } from '~/src/common';
import { dateToString } from '~/src/util';
import { User } from '~/src/user';

function annualPriceString(plan: PlanPrice) {
  return `$${plan} SBD / Annually`;
}

function monthlyPriceString(plan: PlanPrice) {
  return `$${plan} SBD / Monthly`;
}

@Component
export default class extends Vue {

  @State
  user: User;

  @Getter
  loggedIn: boolean;

  get plans() {
    const plans = [];

    for (let planStr of Object.keys(Plan)) {
      const plan: Plan = Number(planStr);
      if (isNaN(plan)) continue;
      if (plan === Plan.BRONZE) {
        plans.push({
          name: 'BRONZE',
          annualPrice: 'FREE',
          monthlyPrice: '-',
          curationQuota: CurationQuota.BRONZE
        });
      } else {
        const name = Plan[plan];
        plans.push({
          name,
          annualPrice: annualPriceString(PlanPrice[name]),
          monthlyPrice: monthlyPriceString(PlanPrice[name + '_MONTHLY']),
          curationQuota: CurationQuota[name]
        });
      }
    }

    return plans;
  }

  get currentPlan() {
    return Plan[this.user.premium.plan];
  }

  get currentPlanExpiry() {
    return dateToString(this.user.premium.expiry);
  }
}
</script>
