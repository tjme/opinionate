# Opinionate

An automated front-end (or full stack) application code generator/scaffolder, that converts a simple (codeless and declarative) definition into a fully functional application.

*Create a working application in minutes: just bring your own PostgreSQL database!*

Or rather, [PostGraphile](https://github.com/graphile/postgraphile) is used to automatically generate a GraphQL API/back-end (derived from your existing database, using introspection). Then the front-end components are generated similarly from the GraphQL using ES6 template files, and any additional metadata you can provide (see below).

This version of Opinionate includes built-in templates that generate functional front-ends using the latest frameworks and technologies. The generated code is [TypeScript](https://www.typescriptlang.org) (and HTML templates) and is fully human-readable, enabling ongoing development and hand crafting. Alternatively, you can refine or customize the templates to better suit your needs, or you can create your own (which could target other technologies, such as React, see below).

Alternatively, Opinionate can be used with other GraphQL server-side technologies, to automatically generate just the front-end/client.

## Prerequisites

- install [Node.js](https://nodejs.org/en)
- optionally install [Yarn](https://yarnpkg.com/) (rather than using NPM)
- install [TypeScript](https://www.typescriptlang.org/) (you may need elevated privileges, e.g. prefix with sudo) `yarn global install typescript`
- install [PostgreSQL](https://www.postgresql.org)
- install PostGraphile globally `sudo yarn global add postgraphile` (or `npm -g i postgraphile`)
- optionally install a good IDE with TypeScript support, e.g. [VS Code](https://code.visualstudio.com)

## Example database installation

- create/configure a PostgreSQL database, e.g. "toh" `sudo -u postgres psql -d template1`, then enter the following SQL commands:

```sql
CREATE USER test WITH PASSWORD 'testpass';
CREATE DATABASE toh;
\c toh
CREATE TABLE hero(id SERIAL PRIMARY KEY, name text NOT NULL);
CREATE OR REPLACE FUNCTION herowithterm(term text)
    RETURNS SETOF hero LANGUAGE 'sql' STABLE
AS $$
    select * from hero where name ILIKE '%'||term||'%'
$$;
INSERT INTO hero (id, name) VALUES
(1, 'Mr. Nice'),
(2, 'Narco'),
(3, 'Bombasto'),
(4, 'Celeritas'),
(5, 'Magneta'),
(6, 'RubberMan'),
(7, 'Dynama'),
(8, 'Dr IQ'),
(9, 'Magma'),
(10, 'Tornado');
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO test;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO test;
\q
```

- create a database sources directory: `mkdir models`

## Example [Vue](https://vuejs.org)/[PrimeVue](https://github.com/primefaces/primevue) front-end, using [Vite](https://github.com/vitejs/vite) and [Villus](https://github.com/logaretm/villus)

- install Vue CLI: `yarn global add @vue/cli`
- initialize: `yarn create @vitejs/app --template vue-ts vue-toh`
- change to your project directory: `cd vue-toh`
- you are advised to initialize version control to help track source code changes (e.g. `git init`)
- copy or merge the template's [package~.json](templates/primevue/package~.json) as your new ./package.json (or selectively copy/paste, especially the following scripts)
- generate JSON schema files: `yarn gen-json`
- generate GraphQL schema files: `yarn gen-gql`
- run the GraphQL server (in the background): `yarn backend &`
- optionally you can click on the link to GraphiQL generated by the above, and explore the server by entering queries such as: `{allHeroes{nodes{nodeId,id,name}}}`
- install dependencies: `yarn`
- create the TypeScript type definitions for the schema: `yarn gen-ts`
- create a configuration/overlay (for later enhancement and customization): `yarn gen-overlay`
- to automatically (re)generate fully functional components/pages for each GraphQL node/entity, as well as common items: `yarn gen`
- run the development server, to deliver your new website: `yarn dev`
- or build: `yarn build` then run a production version: `yarn serve`
- See [README~.md](templates/primevue/README~.md) for further details
- Note: there are also sample copies of the schema files in [models](models)

## Example [Angular](https://angular.io) front-end, using [Angular Material](https://material.angular.io)

- install angular CLI globally (again, you may need elevated privileges) `yarn global add @angular/cli`
- create your Angular project: `ng new ng-toh`
- change to your project directory: `cd ng-toh`
- if using yarn, configure: `ng config cli.packageManager yarn`
- You are advised to initialize version control to help track source code changes (e.g. `git init`)
- generate JSON and GraphQL schema files: `yarn postgraphile -c postgres://test:testpass@/toh -s public -X --export-schema-json ../models/schema.json --export-schema-graphql ../models/schema.gql`
- run the GraphQL server (in the background): `yarn postgraphile -c postgres://test:testpass@/toh -s public -o &`
- optionally you can click on the link to GraphiQL generated by the above, and explore the server by entering queries such as: `{allHeroes{nodes{nodeId,id,name}}}`
- add Angular and Material dependencies: `yarn add rxjs rxjs-compat @angular/material @angular/cdk graphql graphql-tag apollo-client apollo-angular apollo-link apollo-angular-link-http apollo-cache-inmemory`
- install development dependencies: `yarn add -D @graphql-codegen/cli @graphql-codegen/typescript tjme/opinionate`
- create the TypeScript type definitions for the schema, using graphql-codegen: `yarn graphql-codegen --config node_modules/opinionate/codegen.yml`
- to automatically (re)generate fully functional List and CRUD components/pages for each GraphQL node/entity, as well as common items (including app.module.ts and app-routing.module.ts): `yarn opinionate gen --template node_modules/opinionate/templates/angular-material --target ./src/app`
- Note that the above will replace previously generated code without warning, but will not automatically remove any components no longer required
- for more help on options available you can use: `yarn opinionate gen -h`
- run the Angular server: `ng serve --open`
- the front-end will open automatically in your browser, and you will be able to list, add, update and delete heroes that are then stored (persistently) in the database
- you can use the Angular CLI to further build, develop and test (use `ng help` or refer to the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md))
- you can restore the database, with its initial sample data, by re-running the toh.pgsql script (as above)

## Example [Vue](https://vuejs.org)/[Vuetify](https://vuetifyjs.com) front-end

- __*** Work on this option has been suspended until Vuetify is compatible with Vue v3 ***__

- install vue CLI: `yarn global add @vue/cli`
- create your Vue project: `vue create vuetify-toh`, and select manual with babel, pwa, router eslint, (or select the equivalent using `vue ui`), but not with TypeScript currently, due to Vue 3 beta limitations
- change to your project directory: `cd vuetify-toh`
- You are advised to initialize version control to help track source code changes (e.g. `git init`)
- generate JSON and GraphQL schema files: `yarn postgraphile -c postgres://test:testpass@/toh -s public -X --export-schema-json ../models/schema.json --export-schema-graphql ../models/schema.gql`
- run the GraphQL server (in the background): `yarn postgraphile -c postgres://test:testpass@/toh -s public -o &`
- optionally you can click on the link to GraphiQL generated by the above, and explore the server by entering queries such as: `{allHeroes{nodes{nodeId,id,name}}}`
- install Vue v3 beta plugin: `vue add vue-next`
- install Vuetify plugin: `vue add vuetify`
- install Vue Apollo plugin: `vue add apollo` (this doesn't currently seem to work however, but villus may)
- install other GraphQL/Apollo dependencies: `yarn add @vue/apollo-composable apollo-client apollo-link graphql graphql-tag`
- add apollo-composable.js to plugins folder, and add to plugins list in nuxt.config.js
- install development dependencies: `yarn add -D @graphql-codegen/cli @graphql-codegen/typescript tjme/opinionate`
- create the TypeScript type definitions for the schema, using graphql-codegen: `yarn graphql-codegen --config node_modules/opinionate/codegen.yml`
- to automatically (re)generate fully functional components/pages for each GraphQL node/entity, as well as common items: `yarn opinionate gen --template node_modules/opinionate/templates/vuetify`
- run the development server, to deliver your new website: `yarn serve`

## Writing metadata

You can guide and improve the code gneration performed by the template, by adding metadata. For example (when using the built-in template), you can specify more user-friendly labels for individual tables and fields, and whether they should appear on List or CRUD pages.

The `opinionate meta` sub-command can be used in a number of ways to help manage the metadata. You can provide the metadata as a (JSON) overlay file, or in the PostgreSQL schema, as table and field comments. It can create starter (SQL and/or JSON) files, where you need only fill in the gaps (which is especially useful if you have a large schema).

### Example usage of the opinionate meta command

You can generate an overlay file with default metadata using `opinionate meta --overlay-out ../models/overlayOut.json`, similarly you can generate a SQL script to create table and field comments containing metadata using `opinionate meta --comments-out ../models/comments.pgsql`. These assume there is a `../models/schema.json` file describing the GraphQL schema (as produced by PostGraphile), otherwise you should use the `--schema` option to specify an alternative location.

You can define your own metadata structure (e.g. to extend the metadata available to the code generating templates), and this can include code to specify default values. This can simplify the templates, and has the added benefit of allowing some of those settings to be further customized (e.g. in the overlay file) before the final code is generated. Remember though, to add the metadata parameter to both commands, e.g. `opinionate meta --default-meta ../models/customMeta` and `opinionate gen --default-meta ../models/customMeta`. Note that the metadata file is NOT in standard JSON format.

Note that you can use `opinionate meta -h` for more help, especially on defaults and options for the locations of files to read and write.

## Writing your own Opinionate (ES6) template(s)

You can create your own Opinionate template folder tree, and pass it as a parameter, to generate exactly the code you want. Use the existing [templates](templates) as guides, along with the following tips.

The quoting around all existing ES6 template strings (and any substitutions within them) in your code files must be escaped, ie. backticks: `` ` `` must become ``\` ``, and the beginnings of substituions, i.e. `${` must become `$\{`. Also any backslashes (e.g. for escaping) must be doubled-up.

Then add the substitutions required for the code generation.

Use `${types.name}` for the entity/table name.

Similarly, in templates with filenames containing "types", use `${types.name}` for the entity/table name.
Loop through fields with ``// The fields of entity ${types.name} are: ${types.fields.filter(f => isField(f)).map(fields => `${fields.name}`).join("\n")}``.
You can place a guard function at the beginning of a template when metadata should determine existence, e.g: ``${!types.meta.templates.includes("list") ? "" : ` `` (and add `` `} `` at the end).
Escape all embedded backquotes (especially the gql tagged strings) with backslash, e.g:

```js
const Fields = gql\`fragment theFields on ${types.name} { nodeId,${types.fields.map(fields => `${fields.name}`)} }\`;
```

## Motivation

Writing code can be difficult and time consuming, and is often highly repetitive. Code is regularly needed simply to translate from one data representation to another (e.g. SQL to JSON). It would be much easier to produce an application if it could simply be defined (declaratively) in one place, using a single language or notation (some refer to this as DRY: Don't Repeat Yourself).

Though modern frameworks such as Vue and Angular, and technologies such as GraphQL offer a lot of power and flexibility (and their CLIs provides some shortcuts) a lot of boilerplate code is still required to build a full stack application (so it's not very DRY). By making some assumptions (which are arguably opinionated), a lot of boilerplate code can be generated automatically. Even if some of the code is not quite appropriate or requires further development or hand-crafting, it might still save a lot of time. Hopefully also, it might be more efficient to refine the code generation/tool, rather than hand working the code afterwards.

## Structure

![Opinionate UML component diagram](src/Opinionate.png)

Any feedback would be gratefully received!

Thanks,
tim@merrison.co.uk
