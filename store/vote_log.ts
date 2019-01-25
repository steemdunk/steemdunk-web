export interface VoteLogEntry {
  time: string;
  permlink: string;
  status: string;
  weight: string;
}

export const state = () => ({
  log: undefined
});

export const mutations = {
  reset(state: any) {
    state.log = undefined;
  },
  set(state: any, log: VoteLogEntry[]) {
    state.log = log;
  }
};
