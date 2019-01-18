<template>
  <v-layout>
    <v-card width="100%">
      <v-card-title primary-title class="headline">Curating</v-card-title>
      <v-card-actions>
        <AddAuthor @author-added="authorAdded" />
      </v-card-actions>
      <v-card-text>
        <v-expansion-panel ref="panel" v-model="panel" popout>
          <v-expansion-panel-content
              v-for="(author, index) in curating"
              :key="index"
              class="darken-on-hover"
              :class="{ 'author-is-active': isActive(author.author) }">
            <div slot="header">
              <div class="subheading font-weight-medium">{{ author.author }}</div>
              <div class="caption">{{ author.maxDailyVotes > 0 ? 'Active' : 'Paused' }}</div>
            </div>
            <v-card>
              <v-card-text>
                <AuthorSettings :author-settings="authorSettings" />
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
import AuthorSettings from './Author.vue';
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
  components: { AddAuthor, AuthorSettings }
})
export default class Curating extends Vue {

  @State
  curating: Author[];

  panel: number|null = null;
  authorSettings: Author = defaultAuthorModel();

  @Watch('panel')
  updatePanelState(index?: number|null): void {
    if (index === null || index === undefined) {
      this.authorSettings = defaultAuthorModel();
    } else {
      this.authorSettings = Object.assign({}, this.curating[index]);
    }
  }

  isActive(author: string): boolean {
    return this.authorSettings.author === author;
  }

  authorAdded(author: Author) {
    const index = this.curating.findIndex(a => a.author === author.author);
    if (index === -1) {
      console.error('Failed to find index of author:', author.author);
      return;
    }
    this.authorSettings = Object.assign({}, author);
    this.panel = index;
  }
}
</script>
