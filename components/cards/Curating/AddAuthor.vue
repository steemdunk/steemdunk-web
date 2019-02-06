<template>
  <v-form>
    <v-text-field
      v-model="form.author.value"
      style="max-width: 240px;"
      label="Add Author"
      append-icon="add_circle"
      @click:append="addAuthor"
      @keypress.enter="$event.preventDefault(); addAuthor()"
      @blur="form.author.error=undefined"
      :error="!!form.author.error"
      :error-messages="form.author.error"
      spellcheck="false"
      :disabled="premiumExpired"
    ></v-text-field>
  </v-form>
</template>

<script lang="ts">
import { Component, Model, Getter } from 'nuxt-property-decorator';
import { Author } from '~/src/author';
import Vue from 'vue';

interface ErrorableValue {
  value?: string;
  error?: string;
}

interface Form {
  author: ErrorableValue;
}

function defaultFormModel(): Form {
  return {
    author: {
      value: undefined,
      error: undefined
    }
  };
}

@Component
export default class extends Vue {

  get defaultSettings(): Author {
    return {
      author: undefined!,
      voteDelay: 15,
      voteWeight: 100,
      maxDailyVotes: 10
    };
  }

  @Getter
  premiumExpired: boolean;

  @Model(undefined, { default: () => defaultFormModel() })
  form: Form;

  async addAuthor() {
    const authorForm = this.form.author;
    authorForm.error = undefined;

    if (!authorForm.value) return authorForm.error = 'Field is required';
    try {
      const res = await this.$sendApiReq({
        api: 'add_author',
        params: Object.assign(this.defaultSettings, { author: authorForm.value })
      });
      if (res.error) return authorForm.error = res.error;

      authorForm.value = undefined;
      this.$store.commit('curations/add', res.data);
      this.$emit('author-added', res.data);
    } catch (e) {
      this.form.author.error = e.message;
    }
  }
}
</script>
