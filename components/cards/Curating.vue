<template>
  <v-layout>
    <v-card width="100%">
      <v-card-title primary-title class="headline">Curating</v-card-title>
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
                  <v-flex class="px-3">
                    <v-slider
                      v-model="authorSettings[0].voteWeight"
                      :min="0"
                      :max="100"
                      thumb-label
                      persistent-hint
                      hint="The strength of the vote you wish to cast"
                      label="Voting weight"
                    ></v-slider>
                  </v-flex>
                  <v-flex style="max-width: 60px;">
                    <v-text-field
                      :rules="[rules.required, rules.voteWeight]"
                      v-model="authorSettings[0].voteWeight"
                      class="mt-0"
                      hide-details
                      single-line
                      min=0
                      max=100
                      type="number"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex class="px-3">
                    <v-slider
                      v-model="authorSettings[0].voteDelay"
                      :min="0"
                      :max="1440"
                      thumb-label
                      persistent-hint
                      hint="In minutes, ranges from 0 to 1440"
                      label="Voting delay (minutes)"
                    ></v-slider>
                  </v-flex>
                  <v-flex style="max-width: 60px;">
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
                </v-layout>

                <v-layout row>
                  <v-flex class="px-3">
                    <v-slider
                      v-model="authorSettings[0].maxDailyVotes"
                      :min="0"
                      :max="20"
                      thumb-label
                      persistent-hint
                      hint="Maximum daily votes in a 24-hour window"
                      label="Max daily votes"
                    ></v-slider>
                  </v-flex>
                  <v-flex style="max-width: 60px;">
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
import { Author } from '~/src/author';

function defaultAuthorModel(): Author {
  return {
    author: undefined!,
    voteWeight: 0,
    voteDelay: 0,
    maxDailyVotes: 0
  };
}

@Component
export default class Curating extends Vue {

  @State
  curating: Author[];

  @Model(undefined, { default: () => [[]] })
  panel: any[];

  @Model(undefined, { default: (): any[] => [defaultAuthorModel()]})
  authorSettings: Author[];

  rules: any = {
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
