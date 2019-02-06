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
          <v-layout v-if="loggedIn" justify-center row wrap class="pt-3">
            <v-select
              :items="availablePlans"
              @change="planSelected"
              class="ma-1"
              style="max-width: 210px;"
              label="Select a plan"
            />
            <v-select
              :items="paymentPeriods"
              @change="periodSelected"
              style="max-width: 210px;"
              label="Select a payment period"
              class="ma-1"
            />
            <v-btn
              :disabled="!canUpgrade"
              :href="transferUrl(model.selectedPlan, model.period)"
              class="success"
              target="_blank"
            >
              <span>{{user.premium.plan === model.selectedPlan
                      ? 'Renew' : 'Upgrade'}}</span>
            </v-btn>
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
                <v-flex xs12 sm7 md5 lg4>
                  <v-layout>
                    <v-layout>Current plan:</v-layout>
                    <v-layout justify-end>{{currentPlan}}</v-layout>
                  </v-layout>
                  <v-layout>
                    <v-divider class="my-2" />
                  </v-layout>
                  <v-layout>
                    <v-layout>Expires:</v-layout>
                    <v-layout justify-end :class="{ 'red--text font-weight-bold': premiumExpired }">
                      <span>{{currentPlanExpiry}}</span>
                    </v-layout>
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
import { Plan, PlanPrice, CurationQuota, Payment } from '~/src/common';
import { dateToString } from '~/src/util';
import { User } from '~/src/user';

function annualPriceString(plan: PlanPrice) {
  return `$${plan} SBD / Annually`;
}

function monthlyPriceString(plan: PlanPrice) {
  return `$${plan} SBD / Monthly`;
}

enum PaymentPeriod {
  MONTHLY,
  ANNUALLY
}

@Component
export default class extends Vue {

  @State
  user: User;

  @Getter
  loggedIn: boolean;

  @Getter
  premiumExpired: boolean;

  model: {
    selectedPlan?: Plan,
    period?: PaymentPeriod
  } = {
    selectedPlan: undefined,
    period: undefined
  };

  get canUpgrade() {
    return this.model.selectedPlan !== undefined
      && this.model.period !== undefined;
  }

  get availablePlans() {
    const curPlan = this.user.premium.plan;
    const plans = Payment.getUpgradablePlans(curPlan).map(value => {
      return {
        value,
        text: Plan[value]
      };
    });
    plans.splice(0, 0, {
      value: curPlan,
      text: Plan[curPlan]
    });
    return plans;
  }

  get paymentPeriods() {
    return [
      { value: PaymentPeriod.MONTHLY, text: 'Monthly' },
      { value: PaymentPeriod.ANNUALLY, text: 'Annually' }
    ]
  }

  get plans() {
    const plans: any[] = [];

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

  get currentPlanExpiry(): string {
    if (this.user.premium.plan == Plan.BRONZE) return 'Never';
    let str = dateToString(this.user.premium.expiry);
    if (this.premiumExpired) str += ' - Expired';
    return str;
  }

  planSelected(plan: Plan) {
    this.model.selectedPlan = plan;
  }

  periodSelected(period: PaymentPeriod) {
    this.model.period = period;
  }

  transferUrl(plan: Plan, monthly: PaymentPeriod): string {
    if (plan === undefined || monthly === undefined) return '#';
    const base = process.env.SC_HOST + '/sign/transfer';
    const from = encodeURIComponent(this.user.username);
    const to = encodeURIComponent(process.env.SC_BROADCAST_ACCOUNT!);
    const amount = PlanPrice[Plan[plan] + (monthly === PaymentPeriod.MONTHLY ? '_MONTHLY' : '')];
    const memo = Plan[plan] + (monthly === PaymentPeriod.MONTHLY ? '_MONTHLY' : '');
    return base
            + '?from=' + from
            + '&to='+ to
            + '&amount=' + encodeURIComponent(amount.toFixed(3) + ' SBD')
            + '&memo=' + encodeURIComponent(memo);
  }
}
</script>
