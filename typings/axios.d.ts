import { NuxtAxiosInstance } from '@nuxtjs/axios';
import Vue, { ComponentOptions } from 'vue';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    axios?: NuxtAxiosInstance;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $axios: NuxtAxiosInstance;
  }
}
