# Advanced Pagila example [Vue](https://vuejs.org)/[PrimeVue](https://github.com/primefaces/primevue) front-end, using [Vite](https://github.com/vitejs/vite) and [Villus](https://github.com/logaretm/villus)

The following instructions create a somewhat more comprehensive and sophisticated front-end for the pagila example database (use instead of, or after following the standard instructions in [Opinionate](README.md), and after installing the prerequisites described there). They centre on enhancing the handling of foreign key links (especially to actors, categories, films and languages), by automatically displaying more meaningful select/drop-down lists (e.g. of actors and films, on the Film Actors form). However, more could be done (for example, the same could be done for customers, stores, addresses, etc.); but that is left as as an exercise for the reader!

- Enter the following commands (in a terminal):
```sh
mkdir primevue-pagila && cd primevue-pagila
wget -O package.json https://github.com/tjme/opinionate/blob/master/templates/primevue/package-pagila.json 
wget -O pagila.sql https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/pagila.sql
wget -O pagilaExtra.sql https://github.com/tjme/opinionate/blob/master/templates/primevue/pagilaExtra.sql
git init
sudo -u postgres psql -d template1
```

- Then enter the following SQL commands:
```sql
CREATE USER test WITH PASSWORD 'testpass';
CREATE DATABASE pagila;
\c pagila
\i pagila.sql
\i pagilaExtra.sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO test;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO test;
\q
```

- Then the following commands (back in a terminal):
```sh
pnpm backend &
pnpm gen
```

- note that there is a problem with the rental_by_category materialized view not being populated, so remove it by removing all of the templates listed in overlayOut.json (now done automatically when you use package-pagila.json).
- note also, what seems to be a quirk of Postgraphile's pluralize function used on entity names results in an upper case instead of lower case "s" at the end of seven instances of names beginning with "PaymentP202220", but they can be easily accomodated by changes in overlayOut.json, e.g. changing `"plural": "PaymentP202201s",` to `"plural": "PaymentP202201S",`, etc

- it would be wise at this stage to use: `git add -A && git commit -m "opinionate gen"`

- run the development server, to deliver your new website: `pnpm dev`

- You can make further manual improvements (by replacing the somewhat meaningless ids with more descriptive information), as follows.

- In src/components/film.vue:
  - Rename dialog/form Language Id as Language (near end of line 57)
  - Rename dialog/form Original Language Id as Original Language (near end of line 58)
  - Add columns `,languageByLanguageId{_id_},languageByOriginalLanguageId{_id_}` to FilmActorFields's gql (near end of line 106)
  - Update or replace Language Id and Original Language Id datatable columns with (lines 36 and 37)
    ```vue
    <Column field="languageByLanguageId._id_" header="Language" :sortable='true' ><template #body="slotProps"><a :href='"/#/Language?languageId="+slotProps.data.languageId' v-text="slotProps.data.languageByLanguageId._id_" ></a></template></Column>
    <Column field="languageByOriginalLanguageId._id_" header="Original Language" :sortable='true' ><template #body="slotProps"><a :href='"/#/Language?languageId="+slotProps.data.originalLanguageId' v-text="slotProps.data.languageByOriginalLanguageId._id_" ></a></template></Column>
    ```
  - Retain structures, even when null (add new lines 184 and 185)
    ```vue
    languageByLanguageId: { _id_: r.languageByLanguageId?._id_ || null },
    languageByOriginalLanguageId: { _id_: r.languageByOriginalLanguageId?._id_ || null },

    ```

- In src/components/filmactor.vue:
  - Rename dialog/form Actor Id as Actor (near end of line 40)
  - Rename datatable column Film Id as Film (near end of line 41)
  - Add columns `,actorByActorId{_id_},filmByFilmId{_id_}` to FilmActorFields's gql (after lastUpdate on line 84)
  - Update or replace Actor Id and Film Id datatable columns with (lines 32 and 33)
    ```vue
    <Column field="actorByActorId._id_" header="Actor" :sortable='true' ><template #body="slotProps"><a :href='"/#/Actor?actorId="+slotProps.data.actorId' v-text="slotProps.data.actorByActorId._id_" ></a></template></Column>
    <Column field="filmByFilmId._id_" header="Film" :sortable='true' ><template #body="slotProps"><a :href='"/#/Film?filmId="+slotProps.data.filmId' v-text="slotProps.data.filmByFilmId._id_" ></a></template></Column>
    ```

- In src/components/filmcategory.vue:
  - Rename datatable column Film Id as Film (near end of line 40)
  - Rename dialog/form Category Id as Category (near end of line 41)
  - Add columns `,filmByFilmId{_id_},categoryByCategoryId{_id_}` to FilmCategoryFields's gql (after lastUpdate on line 84)
  - Update or replace Category Id and Film Id datatable columns with (lines 32 and 33)
    ```vue
    <Column field="filmByFilmId._id_" header="Film" :sortable='true' ><template #body="slotProps"><a :href='"/#/Film?filmId="+slotProps.data.filmId' v-text="slotProps.data.filmByFilmId._id_" ></a></template></Column>
    <Column field="categoryByCategoryId._id_" header="Category" :sortable='true' ><template #body="slotProps"><a :href='"/#/category?CategoryId="+slotProps.data.categoryId' v-text="slotProps.data.categoryByCategoryId._id_" ></a></template></Column>
    ```

- In src/components/inventory.vue:
  - Rename dialog/form Film Id as Film (near end of line 43)
  - Add columns `,filmByFilmId{_id_}` to InventoryFields's gql (near end of line 87)
  - Update or replace Film Id datatable column with (line 33)
    ```vue
    <Column field="filmByFilmId._id_" header="Film" :sortable='true' ><template #body="slotProps"><a :href='"/#/Film?filmId="+slotProps.data.filmId' v-text="slotProps.data.filmByFilmId._id_" ></a></template></Column>
    ```

- it would be wise at this stage to use: `git add -A && git commit -m "now with recommended manual code amendments"`
