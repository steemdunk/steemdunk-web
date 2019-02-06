<template>
  <v-card>
    <v-card-title primary-title class="headline">Curating</v-card-title>
    <v-card-actions class="pl-3">
      <AddAuthor @author-added="authorAdded" />
    </v-card-actions>
    <v-card-text>
      <v-expansion-panel
        v-model="panel"
        style="overflow: auto; max-height: 450px;"
        ref="panel"
      >
        <v-expansion-panel-content
          v-for="(author, index) in curating"
          :key="index"
          :class="{ 'author-is-active': isActive(author.author) }"
          class="darken-on-hover"
          ripple
        >
          <div slot="header">
            <div class="subheading font-weight-medium">{{ author.author }}</div>
            <div v-if="!isActive(author.author)" class="caption">
              <span>{{ author.maxDailyVotes > 0 ? 'Active' : 'Paused' }}</span>
            </div>
            <div v-else>
              <span>{{ authorSettings.maxDailyVotes > 0 ? 'Active' : 'Paused' }}</span>
            </div>
          </div>
          <v-card v-if="isActiveOrTransition(author.author)">
            <v-progress-linear
              :active="saving !== SaveState.NONE"
              :indeterminate="saving === SaveState.SAVING"
              :color="saveColor"
              value="100"
            />
            <v-card-text>
              <AuthorSettings
                :author-settings="isActive(author.author) ? authorSettings : authorTransition"
                @author-removed="panel = null"
                @saving="saving = $event"
              />
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card-text>
  </v-card>
</template>

<style lang="stylus" scoped>
// This only supports the light material theme, to support dark use rgba(#fff, 0.08)
.author-is-active, .darken-on-hover:hover {
  background-color: rgba(#000, .04) !important;
}
</style>

<script lang="ts">
import { Vue, Component, Watch, State } from 'nuxt-property-decorator';
import AuthorSettings, { SaveState } from './Author.vue';
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

  readonly SaveState = SaveState;

  @State(state => state.curations.curating)
  curating: Author[];

  observer: MutationObserver|null = null;
  panel: number|null = null;

  authorSettings: Author = defaultAuthorModel();
  authorTransition: Author = defaultAuthorModel();

  saving: SaveState = SaveState.NONE;

  get saveColor() {
    switch (this.saving) {
      case SaveState.COMPLETE:
        return 'success';
      case SaveState.ERROR:
        return 'error';
      default:
        return undefined;
    }
  }

  // Vue lifecycle event
  beforeDestroy() {
    this.disconnectObserver();
  }

  disconnectObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  @Watch('panel')
  updatePanelState(index?: number|null): void {
    this.disconnectObserver();
    this.authorTransition = Object.assign({}, this.authorSettings);
    if (index === null || index === undefined) {
      this.authorSettings = defaultAuthorModel();
      return;
    }

    this.authorSettings = Object.assign({}, this.curating[index]);
    this.observer = new MutationObserver(records => {
      for (let r of records) {
        const cl = (r.target as HTMLElement).getAttribute('class');
        if (cl && !/expand-transition-enter-active/.test(cl)) {
          this.disconnectObserver();
          this.scrollToAuthor();
          break;
        }
      }
    });

    const panel = this.$refs.panel as Vue;
    const child = panel.$children[index];
    const el = child.$el.querySelector('.v-expansion-panel__body');
    this.observer.observe(el!, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  isActive(author: string): boolean {
    return this.authorSettings.author === author;
  }

  isActiveOrTransition(author: string): boolean {
    return this.authorSettings.author === author
            || this.authorTransition.author === author;
  }

  authorAdded(author: Author) {
    const index = this.curating.findIndex(a => a.author === author.author);
    if (index === -1) {
      console.error('Failed to find index of author:', author.author);
      return;
    }
    this.authorTransition = Object.assign({}, this.authorSettings);
    this.authorSettings = Object.assign({}, author);
    this.$nextTick(() => {
      this.panel = index;
    });
  }

  scrollToAuthor() {
    if (this.panel === null) return;
    const panel = this.$refs.panel as Vue;
    const el = panel.$el as any;
    (this.$vuetify.goTo as any)(panel.$children[this.panel], {
      container: panel,
      duration: 300,
      offset: el.offsetParent.offsetTop + el.offsetTop,
      easing: 'easeInOutCubic'
    });
  }
}
</script>
