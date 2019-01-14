import { RpcRequest, RpcResponse } from '~/plugins/rpc';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import Vue, { ComponentOptions } from 'vue';

type SendApiRequest = (req: RpcRequest, token?: string) => Promise<RpcResponse>;

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $sendApiReq?: SendApiRequest;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $sendApiReq: SendApiRequest;
  }
}
