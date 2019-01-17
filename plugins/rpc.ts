import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { User } from '~/src/user';

export interface RpcRequest {
  api: string;
  params?: any;
}

export interface RpcResponse {
  data?: any;
  error?: any;
}

export class ApiError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export default function({ store, $axios }, inject) {
  inject('sendApiReq', async function(req: RpcRequest, token?: string): Promise<RpcResponse> {
    const axios: NuxtAxiosInstance = $axios;
    let headers: any = {};
    if (token) {
      headers.session = token;
    } else {
      const user: User = store.state.user;
      if (user) headers.session = user.sessionToken;
    }
    if (!headers.session) throw new Error('session token not provided');
    try {
      const res = await axios.post('/api/v2', req, {
        headers
      });
      return res.data;
    } catch (e) {
      if (e.response === undefined) {
        throw new Error('Connection refused to API server');
      } else if (e.response.status === 400) {
        throw new ApiError(e.response.data.error);
      }
      throw e;
    }
  });
}
