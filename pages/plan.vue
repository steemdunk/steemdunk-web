<template>
  <div>
    <v-container class="pb-0">
      <v-alert :value="downgradeModel.error" type="error">{{downgradeModel.error}}</v-alert>
    </v-container>
    <v-dialog width="500" v-model="downgradeModel.display">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          <span>Are you sure you want to downgrade?</span>
        </v-card-title>
        <v-card-text>
          <span>Your account will be immediately downgraded </span>
          <span>and any benefits of your current plan will be terminated. </span>
          <span>If your curation count exceeds the plan limit, authors must </span>
          <span>be removed before proceeding.</span>
        </v-card-text>
        <v-card-text v-if="model.selectedPlan !== Plan.BRONZE">
          <span>You will be directed to SteemConnect for payment. No actions </span>
          <span>will be taken to your account until payment is received.</span>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="error" @click="downgradeAccount">Accept</v-btn>
          <v-btn flat @click="downgradeModel.display = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container>
      <v-card>
        <v-card-title primary-title class="headline">Payment Plans</v-card-title>
        <v-card-text>
          <v-layout row wrap justify-center>
            <v-flex xs8 sm4 md4 v-for="(plan, i) in plans" :key="i">
              <v-sheet class="pa-3 ma-2" elevation="3">
                <v-layout column>
                  <v-layout justify-center>
                    <strong class="title">{{plan.text}}</strong>
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
              :items="plans"
              @change="planSelected"
              class="ma-1"
              style="max-width: 210px;"
              label="Select a plan"
            />
            <v-select
              :items="paymentPeriods"
              :disabled="model.selectedPlan === Plan.BRONZE"
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
            <v-btn
              v-if="user.premium.plan !== Plan.BRONZE"
              @click="downgradeModel.display = true"
              :disabled="model.selectedPlan === undefined
                          || (model.selectedPlan !== Plan.BRONZE && model.period === undefined)
                          || user.premium.plan <= model.selectedPlan"
              class="error"
            >
              <span>Downgrade</span>
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
import { Plan, PlanPrice, CurationQuota } from '~/src/common';
import { dateToString } from '~/src/util';
import { User } from '~/src/user';
import { ApiError } from '~/plugins/rpc';

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

  readonly Plan = Plan;

  @State
  user: User;

  @Getter
  loggedIn: boolean;

  @Getter
  premiumExpired: boolean;

  downgradeModel = {
    display: false,
    error: null as string|null
  };

  model = {
    selectedPlan: undefined as Plan|undefined,
    period: undefined as PaymentPeriod|undefined
  };

  get canUpgrade() {
    return this.model.selectedPlan !== undefined
      && this.model.selectedPlan !== Plan.BRONZE
      && this.user.premium.plan <= this.model.selectedPlan
      && this.model.period !== undefined;
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
          value: plan,
          text: 'BRONZE',
          annualPrice: 'FREE',
          monthlyPrice: '-',
          curationQuota: CurationQuota.BRONZE
        });
      } else {
        const text = Plan[plan];
        plans.push({
          value: plan,
          text,
          annualPrice: annualPriceString(PlanPrice[text]),
          monthlyPrice: monthlyPriceString(PlanPrice[text + '_MONTHLY']),
          curationQuota: CurationQuota[text]
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
    if (plan === undefined
        || plan === Plan.BRONZE
        || monthly === undefined) return '#';
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

  async downgradeAccount() {
    this.downgradeModel.display = false;
    this.downgradeModel.error = null;

    const plan = this.model.selectedPlan!;
    if (plan === Plan.BRONZE) {
      try {
        const data = (await this.$sendApiReq({
          api: 'bronze_downgrade'
        })).data;
        this.$store.commit('userPremium', data);
      } catch (e) {
        if (e instanceof ApiError) {
          this.downgradeModel.error = e.message;
          this.$vuetify.goTo(0);
          return;
        }
        throw e;
      }
      return;
    }

    const url = this.transferUrl(plan, this.model.period!);
    window.open(url, '_blank');
  }
}
</script>
