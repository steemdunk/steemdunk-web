<template>
  <v-form>
    <v-text-field
      v-model="form.author.value"
      style="max-width: 240px;"
      label="Add Author"
      append-icon="add_circle"
      @click:append="addAuthor"
      @blur="form.author.error=undefined"
      :error="!!form.author.error"
      :error-messages="form.author.error"
      spellcheck="false"
    ></v-text-field>
  </v-form>
</template>

<script lang="ts">
import { Component, Model } from 'nuxt-property-decorator';
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

  @Model(undefined, { default: () => defaultFormModel() })
  form: Form;

  addAuthor() {
    this.form.author.error = undefined;

    if (!this.form.author.value) {
      this.form.author.error = 'Field is required';
    }
  }
}
</script>
