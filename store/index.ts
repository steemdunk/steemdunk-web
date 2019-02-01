import { User, Settings } from '~/src/user';
import { RpcRequest } from '~/plugins/rpc';
import { dateToString } from '~/src/util';
import { Author } from '~/src/author';

export const state = () => ({
  user: undefined
});

export const mutations = {
  reset(state: any) {
    state.user = undefined;
  },
  user(state: any, user: User) {
    state.user = user;
  },
  userSettings(state: any, settings: Settings) {
    state.user.settings = settings;
  }
};

export const getters = {
  loggedIn(state: any) {
    return state.user !== undefined;
  }
}

export const actions = {
  async nuxtServerInit(this: any, { commit }, { req, res }) {
    const Cookies = require('cookies');
    const cookies = new Cookies(req, res);
    const session = cookies.get('session');
    if (!session) return;

    try {
      const data = (await this.$sendApiReq(<RpcRequest>{
        api: 'get_account'
      }, session)).data;
      commit('user', data);
    } catch (e) {
      if (e.response && e.response.status === 401) {
        // Session expired
        cookies.set('session', '', {
          expires: new Date(0)
        });
        return;
      }
      throw e;
    }

    {
      const data: Author[] = (await this.$sendApiReq(<RpcRequest>{
        api: 'get_authors'
      })).data;
      commit('curations/set', data);
    }

    {
      const res = await this.$sendApiReq(<RpcRequest>{
        api: 'get_vote_log'
      });
      const data = res.data.map((val: any) => {
        let status: string|undefined;
        let weight: string|undefined;
        if (val.status === 0) {
          status = 'SUCCESS';
          weight = val.weight + '%';
        } else if (val.status === 1) {
          status = 'MANUAL VOTE';
          weight = val.weight + '%';
        } else if (val.status === 2) {
          status = 'FAIL';
          weight = '-';
        } else if (val.status === 3) {
          status = 'DAILY LIMIT EXCEEDED';
          weight = '-'
        } else if (val.status === 4) {
          status = 'PAUSED';
          weight = '-';
        }
        return {
          time: dateToString(new Date(val.timestamp)),
          permlink: '@' + val.author + '/' + val.permlink,
          weight,
          status
        };
      });
      commit('vote_log/set', data);
    }
  },
  async reset({ commit }): Promise<void> {
    commit('reset');
    commit('curations/reset');
    commit('vote_log/reset');
  }
};
