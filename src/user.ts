import { Plan } from 'steemdunk-common';

export interface Steem {
  votingPowerPercent: number;
}

export interface Premium {
  plan: Plan,
  expiry: Date
}

export interface User {
  readonly sessionToken: string;
  readonly username: string;
  readonly premium: Premium;
  readonly steem: Steem;
}
