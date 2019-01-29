import { Plan } from '../node_modules/steemdunk-common/src/payment';

export interface Premium {
  plan: Plan;
  expiry: Date;
}

export interface Settings {
  botSupport: boolean;
  claimRewards: boolean;
  globalVotePause: boolean;
}

export interface Steem {
  votingPowerPercent: number;
}

export interface User {
  readonly session: string;
  readonly username: string;
  readonly premium: Premium;
  readonly settings: Settings;
  readonly steem: Steem;
}
