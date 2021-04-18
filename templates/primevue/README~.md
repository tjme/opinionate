# PrimeVue sample

A sample app to demonstrate the use of the following combination of tech. (as a basis for developing templates for opinionate):

- PostgreSQL
- PostGraphile
- Vue v3
- TypeScript
- Vee-Validate
- PrimeVue
- Villus
- Vite

This version supports a fully functional datatable (for a single entity), including pagination, sorting and column sizing (with both left and right-aligned columns).

In addition, full CRUD operations are supported (mostly via a pop-up form dialog), with an optimistic UI.

Communications with the GraphQL server are supported by Villus (rather than the more popular Apollo), primarily because I was able to make it function correctly with the Vue v3/Composition API.

Work in progress:

- linking fields/columns not yet covered (e.g. counts of related)
