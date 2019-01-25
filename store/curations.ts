import { Author } from '~/src/author';

export const state = () => ({
  curating: undefined
});

export const mutations = {
  reset(state: any) {
    state.curating = undefined;
  },
  set(state: any, authors: Author[]) {
    state.curating = authors;
    mutations.sort(state);
  },
  sort(state: any) {
    state.curating.sort(function(a: Author, b: Author) {
      return a.author < b.author ? -1 : 1;
    });
  },
  add(state: any, author: Author) {
    state.curating.push(author);
    mutations.sort(state);
  },
  update(state: any, author: Author) {
    const curating: Author[] = state.curating;
    let index = curating.findIndex(v => v.author === author.author);
    if (index === -1) return;
    curating[index] = author;
  },
  remove(state: any, author: string) {
    const curating: Author[] = state.curating;
    const index = curating.findIndex(v => v.author === author);
    if (index === -1) return;
    curating.splice(index, 1);
  }
};
