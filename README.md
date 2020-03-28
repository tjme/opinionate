# Opinionate

An automated front-end (or full stack) application code generator/scaffolder, that converts a simple (codeless and declarative) definition into a fully functional application.

*Create a working application in minutes: just bring your own PostgreSQL database!*

Or rather, [PostGraphile](https://github.com/graphile/postgraphile) is used to automatically generate a GraphQL API/back-end (derived from your existing database, using introspection). Then the front-end components are generated similarly from the GraphQL using ES6 template files, and any additional metadata you can provide (see below).

This version of Opinionate includes built-in templates that generate a fully functional front-end, using the latest [Angular 6](https://angular.io), [Angular Material](https://material.angular.io) and [Apollo Client](https://www.apollographql.com/docs/angular). The generated code is [TypeScript](https://www.typescriptlang.org) (and HTML templates) and is fully human-readable, enabling ongoing development and hand crafting. Alternatively, you can refine or customize the templates to better suit your needs, or you can create your own (which could target other technologies, such as React or VueJS, see below).

Alternatively, Opinionate can be used with other GraphQL server-side technologies, to automatically generate just the front-end/client.

## Motivation

Writing code is frequently difficult and time consuming, and can often be highly repetitive. Code is regularly needed simply to translate from one data representation to another (e.g. SQL to JSON). It would be much easier to produce an application if it could simply be defined (declaratively) in one place, using a single language or notation (some refer to this as DRY, Don't Repeat Yourself).

Though modern frameworks like Angular and technologies such as GraphQL offer a lot of power and flexibility (and the Angular CLI provides some shortcuts) a lot of boilerplate code is still required, to build a full stack application (so it's not very DRY). By making some assumptions (which may arguably be opinionated), a lot of boilerplate code can be generated automatically. Even if some of the code is not quite appropriate or requires further development or hand-crafting, it might still save a lot of time. Hopefully also, it might often be more efficient to refine the code generation/tool, rather than hand working the code afterwards.

## Prerequisites

- install [Node.js](https://nodejs.org/en)
- install [TypeScript](https://www.typescriptlang.org/)
- install [PostgreSQL](https://www.postgresql.org)
- optionally install a good IDE with TypeScript support, e.g. [VS Code](https://code.visualstudio.com)
- optionally install Yarn (rather than using NPM)

## Example installation and usage

- create your project directory, e.g. `mkdir toh`
- change to your project directory `cd toh`
- install opinionate as a development dependency `yarn --dev add tjme/opinionate`
- create a sources directory `mkdir src`, and a database sources directory `mkdir src/models`
- create/configure a PostgreSQL database, e.g. "toh" `sudo -u postgres psql -d template1`, then enter the following SQL commands:

```sql
CREATE USER test WITH PASSWORD 'testpass';
CREATE DATABASE toh;
\c toh
\i node_modules/opinionate/models/toh.pgsql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO test;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO test;
\q
```

- install PostGraphile globally (you may need elevated privileges, e.g. prefix with sudo) `yarn global add postgraphile` (or `npm -g i postgraphile`)
- generate a JSON schema file `postgraphile -c postgres://test:testpass@/toh -s public -X --export-schema-json src/models/schema.json` (and optionally also a GraphQL schema, by appending `--export-schema-graphql src/models/schema.gql`)
- run the GraphQL server (in the background) with `postgraphile -c postgres://test:testpass@/toh -s public -o &`
- optionally you can click on the link to GraphiQL generated by the above, and explore the server by entering queries such as: `{allHeroes{nodes{nodeId,id,name}}}`
- install opinionate globally (you may need elevated privileges, e.g. prefix with sudo) `yarn global add tjme/opinionate` (or `npm -g i tjme/opinionate`)
- run `yarn run opinionate gen` to automatically (re)generate fully functional List and CRUD components/pages for each GraphQL node/entity, as well as common items (including app.module.ts and app-routing.module.ts). It will replace previously generated code without warning (but will not automatically remove any components no longer present, so you may want to first remove all generated code with `yarn run gencodeclean`, but use with caution!)
- use `opinionate gen -h` for more help on options available
- install angular CLI globally (again, you may need elevated privileges) `yarn global add @angular/cli`
- if using yarn, configure `ng set --global packageManager=yarn`
- install the dependencies with `yarn` (or `npm i`)
- run the Angular server `ng serve --open`
- the front-end will open automatically in your browser, and you will be able to list, add, update and delete heroes that are then stored (persistently) in the database
- you can use the Angular CLI to further build, develop and test (use `ng help` or refer to the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md))
- you can restore the database, with its initial sample data, by re-running the toh.pgsql script (as above)

## Writing metadata

You can guide and improve the code gneration performed by the template, by adding metadata. For example (when using the built-in template), you can specify more user-friendly labels for individual tables and fields, and whether they should appear on List or CRUD pages.

The `opinionate meta` sub-command can be used in a number of ways to help manage the metadata. You can provide the metadata as a (JSON) overlay file, or in the PostgreSQL schema, as table and field comments. It can create starter (SQL and/or JSON) files, where you need only fill in the gaps (which is especially useful if you have a large schema).

In future versions, it may also be included as directives in the GraphQL schema (when directives are better defined and/or external tools and dependencies allow).

### Example usage of opinionate meta

You can generate an overlay file with default metadata using `opinionate meta --overlay-out ./src/models/overlayOut.json`, similarly you can generate a SQL script to create table and field comments containing metadata using `opinionate meta --comments-out ./src/models/comments.pgsql`. These assume there is a `./src/models/schema.json` file describing the GraphQL schema (as produced by PostGraphile), otherwise you should use the `--schema` option to specify an alternative location.

Note that you can use `opinionate meta -h` for more help, especially on options for the locations on files to read and write.

## Writing your own Opinionate ES6 template(s)

You can create your own Opinionate template folder tree, and pass it as a parameter, to generate exactly the code you want. Use the existing one (in `node_modules/opinionate/template`) as a guide, along with the following tips.

All existing ES6 template strings (and any substitutions within them) in your code files must be escaped, ie. backticks: `` ` `` must become ``\` ``, and substituions, i.e. `${` combinations must become `$\{`.

Then add the substitutions required for the code generation.

Use `${types.name}` for the entity/table name.

Similarly, in templates with filenames containing "types", use `${types.name}` for the entity/table name.
Loop through fields with ``// The fields of entity ${types.name} are: ${types.fields.filter(f => isField(f)).map(fields => `${fields.name}`).join("\n")}``.
Can place guard function at beginning of template when metadata should determine existence, e.g: ``${!types.meta.templates.includes("list") ? "" : ` ``.
Escape all embedded backquotes (especially the gql tagged strings) with backslash, e.g:

```js
const Fields = gql\`fragment theFields on ${types.name} { nodeId,${types.fields.map(fields => `${fields.name}`)} }\`;
```

## Structure

![Opinionate UML component diagram](src/Opinionate.png)

## Issues (mostly with the built-in template)

The generated front-end is currently quite basic, both in form and function. Though it is more straightforward to address the former through manually added theming and CSS styling, the latter should be addressed in susequent releases, through deeper introspection (e.g. to support linking between entities), and perhaps through additional direction in the form of schema annotations/directives.

Note that the previous version of Opinionate used GraphQL Code Generator with Handlebars (rather than ES6) templates, and this version has not yet replaced the TypeScript definitions for the GraphQL types, so in the meantime you may want to use `yarn run gentypes`.

Any feedback would be gratefully received!

Thanks,
tim@merrison.co.uk
