<template>
  <v-layout>
    <v-card width="100%">
      <v-card-title primary-title class="headline">Curating</v-card-title>
      <v-card-actions>
        <AddAuthor />
      </v-card-actions>
      <v-card-text>
        <v-expansion-panel v-model="panel[0]" popout>
          <v-expansion-panel-content
              v-for="author in curating"
              :key="author.author"
              class="darken-on-hover"
              :class="{ 'author-is-active': isActive(author.author) }">
            <div slot="header">
              <div class="subheading font-weight-medium">{{ author.author }}</div>
              <div class="caption">{{ author.maxDailyVotes > 0 ? 'Active' : 'Paused' }}</div>
            </div>
            <v-card>
              <v-card-text>
                <!-- Start settings -->
                <v-layout row>
                  <v-flex xs8 md3>
                    <v-layout class="pt-2 body-2">Voting Weight</v-layout>
                    <v-layout class="caption">The strength of the vote you wish to cast</v-layout>
                  </v-flex>
                  <v-flex class="pr-3" style="max-width: 60px;">
                    <v-text-field
                      :rules="[rules.required, rules.voteWeight]"
                      v-model="authorSettings[0].voteWeight"
                      class="mt-0"
                      hide-details
                      single-line
                      min=1
                      max=100
                      type="number"
                    ></v-text-field>
                  </v-flex>
                  <v-flex class="hidden-xs-only">
                    <v-slider
                      v-model="authorSettings[0].voteWeight"
                      :min="1"
                      :max="100"
                      thumb-label
                      always-dirty
                    ></v-slider>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs8 md3>
                    <v-layout class="pt-2 body-2">Voting Delay</v-layout>
                    <v-layout class="caption">In minutes, ranges from 0 to 1440</v-layout>
                  </v-flex>
                  <v-flex class="pr-3" style="max-width: 60px;">
                    <v-text-field
                      :rules="[rules.required, rules.voteDelay]"
                      v-model="authorSettings[0].voteDelay"
                      class="mt-0"
                      hide-details
                      single-line
                      min=0
                      max=1440
                      type="number"
                    ></v-text-field>
                  </v-flex>
                  <v-flex class="hidden-xs-only">
                    <v-slider
                      v-model="authorSettings[0].voteDelay"
                      :min="0"
                      :max="1440"
                      thumb-label
                      always-dirty
                    ></v-slider>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs8 md3>
                    <v-layout class="pt-2 body-2">Max Daily Votes</v-layout>
                    <v-layout class="caption">Maximum daily votes in a 24-hour window</v-layout>
                  </v-flex>
                  <v-flex class="pr-3" style="max-width: 60px;">
                    <v-text-field
                      :rules="[rules.required, rules.maxDailyVotes]"
                      v-model="authorSettings[0].maxDailyVotes"
                      class="mt-0"
                      hide-details
                      single-line
                      min=0
                      max=20
                      type="number"
                    ></v-text-field>
                  </v-flex>
                  <v-flex class="hidden-xs-only">
                    <v-slider
                      v-model="authorSettings[0].maxDailyVotes"
                      :min="0"
                      :max="20"
                      thumb-label
                    ></v-slider>
                  </v-flex>
                </v-layout>
                <!-- End settings -->
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<style lang="stylus" scoped>
// This only supports the light material theme, to support dark use rgba(#fff, 0.08)
.author-is-active, .darken-on-hover:hover {
  background-color: rgba(#000, .04) !important;
}
</style>

<script lang="ts">
import { Vue, Component, Model, Watch, State } from 'nuxt-property-decorator';
import { RpcRequest } from '~/plugins/rpc';
import AddAuthor from './AddAuthor.vue';
import { Author } from '~/src/author';

function defaultAuthorModel(): Author {
  return {
    author: undefined!,
    voteWeight: 0,
    voteDelay: 0,
    maxDailyVotes: 0
  };
}

@Component({
  components: { AddAuthor }
})
export default class Curating extends Vue {

  @State
  curating: Author[];

  @Model(undefined, { default: () => [[]] })
  panel: any[];

  @Model(undefined, { default: (): any[] => [defaultAuthorModel()]})
  authorSettings: Author[];

  readonly rules = {
    required: val => (val !== '' && val !== undefined) || 'Required.',
    voteWeight: val => (val >= 0 && val <= 100) || 'Out of range.',
    voteDelay: val => (val >= 0 && val <= 1440) || 'Out of range.',
    maxDailyVotes: val => (val >= 0 && val <= 20) || 'Out of range.'
  };

  @Watch('panel')
  updatePanelState(val: any[]): void {
    let index = val[0];
    if (index === null || index === undefined) {
      this.authorSettings[0] = defaultAuthorModel();
    } else {
      const author = Object.assign({}, this.curating[index]);
      this.$set(this.authorSettings, 0, author);
    }
  }

  isActive(author: string): boolean {
    return this.authorSettings[0].author === author;
  }
}
</script>
