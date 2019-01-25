<template>
  <v-card>
    <v-card-title primary-title class="headline">Vote Log (7 days retention)</v-card-title>
    <v-card-text>
      <v-data-table
        no-data-text="Looks like you haven't voted on anyone yet, go add some authors!"
        :headers="headers"
        :items="voteLog"
        disable-initial-sort
      >
        <template slot="items" slot-scope="props">
          <td class="pa-0" style="width: 11em">{{props.item.time}}</td>
          <td class="pa-0 pl-3" style="width: 13em">{{props.item.status}}</td>
          <td class="pa-0 pl-3" style="width: 4em">{{props.item.weight}}</td>
          <td class="pa-0 pl-3">
            <a target="_blank" :href="baseUrl + props.item.permlink">{{
            props.item.permlink.length > 48 ?
              props.item.permlink.substring(0, 48) + '...'
              : props.item.permlink
            }}</a>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, State } from 'nuxt-property-decorator';
import { VoteLogEntry } from '~/store/vote_log';
import Vue from 'vue';

@Component
export default class extends Vue {

  readonly baseUrl = 'https://steemit.com/';

  readonly headers = [
    {
      text: 'Date',
      value: 'time',
      class: 'pa-0'
    },
    {
      text: 'Status',
      value: 'status',
      class: ['pa-0', 'pl-3']
    },
    {
      text: 'Weight',
      value: 'weight',
      class: ['pa-0', 'pl-3']
    },
    {
      text: 'Permlink',
      value: 'permlink',
      class: ['pa-0', 'pl-3']
    }
  ];

  @State(state => state.vote_log.log)
  voteLog: VoteLogEntry[];

}
</script>

