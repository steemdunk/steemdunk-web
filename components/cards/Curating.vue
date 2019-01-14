<template>
  <v-layout>
    <v-card width="100%">
      <v-card-title primary-title class="headline">Curating</v-card-title>
      <v-card-text>
        <v-expansion-panel popout>
          <v-expansion-panel-content v-for="author in curating" :key="author.author">
            <div slot="header">
              <div class="subheading font-weight-medium">{{ author.author }}</div>
              <div class="caption">{{ author.maxDailyVotes > 0 ? 'Active' : 'Paused'}}</div>
            </div>
            <v-card>
              <v-card-text>Hello world!</v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<style lang="stylus" scoped>
</style>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RpcRequest } from '~/plugins/rpc';
import { Author } from '~/src/author';

@Component({})
export default class extends Vue {

  get curating(): Author[] {
    return this.$store.state.curating;
  }

}
</script>
