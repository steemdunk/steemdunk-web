import { RpcRequest } from '~/plugins/rpc';
import { Author } from '~/src/author';
import { User } from '~/src/user';
import Cookies from 'cookies';

export const state = () => ({
  user: undefined,
  curating: undefined
});

export const mutations = {
  reset(state: any) {
    state.user = undefined;
    state.curating = undefined;
  },
  user(state: any, user: User) {
    state.user = user;
  },
  sortCurations(state: any) {
    state.curating.sort(function(a: Author, b: Author) {
      return a.author < b.author ? -1 : 1;
    });
  },
  curating(state: any, authors: Author[]) {
    state.curating = authors;
    mutations.sortCurations(state);
  },
  addCuration(state: any, author: Author) {
    state.curating.push(author);
    mutations.sortCurations(state);
  }
};

export const actions = {
  async nuxtServerInit({ commit }, { req, res }) {
    const cookies = new Cookies(req, res);
    const session = cookies.get('session');
    if (!session) return;

    try {
      const data = (await this.$sendApiReq(<RpcRequest>{
        api: 'get_account'
      }, session)).data;

      const user: User = {
        sessionToken: data.session,
        username: data.username,
        premium: {
          plan: data.premium.plan,
          expiry: new Date(data.premium.expiry)
        },
        steem: {
          votingPowerPercent: data.steem.voting_power_percent
        }
      };
      commit('user', user);
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
      commit('curating', data);
    }
  },
  async curating({ state }): Promise<Author[]> {
    return state.curating;
  }
};
