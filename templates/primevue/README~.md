# PrimeVue sample

A sample app to demonstrate the use of the following tech. stack:

- [PostgreSQL](https://www.postgresql.org)
- [PostGraphile](https://github.com/graphile/postgraphile)
- [TypeScript](https://www.typescriptlang.org)
- [Vue (v3+)](https://vuejs.org)
- [PrimeVue](https://github.com/primefaces/primevue)
- [Villus](https://github.com/logaretm/villus)
- [VeeValidate](https://vee-validate.logaretm.com)
- [Vite](https://github.com/vitejs/vite)

This version supports fully functional datatables (for each entity), with clickable references/counts/links to related datatables/entities including pagination, sorting and column sizing (with left, centre and right-aligned columns).

In addition, full create, read, write and delete (CRUD) operations are supported (mostly via a pop-up form dialog).

Communications with the GraphQL server are supported by Villus (rather than the commonly used Apollo), primarily because it functioned more readily with Vue v3 and the composition API.

Work in progress:

- Where link counts for (one to many) related entities are generated, the first field is *assumed* to be the primary key (and recorded as field.link.fieldsFrom).
- A basic homepage/switchboard is created as a *starting point*, but it may need refinement (e.g. it might not perform well with a large database).
- You may want to restructure the menubar (in src/App.vue) by reordering and/or splitting into submenus (as hinted at in App.vue comments).
