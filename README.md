# Opinionate

An automated full stack application code generator/scaffolder. You provide a PostgreSQL database or schema, and Opinionate does all the rest!

Or rather, [PostGraphile](https://github.com/graphile/postgraphile) is used to automatically generate a GraphQL API/back-end (derived using introspection). Then the front-end components are generated similarly from the GraphQL (using [Handlebars](http://handlebarsjs.com) templates and the [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator)). This version automatically generates an [Angular](https://angular.io) front-end, using [Angular Material](https://material.angular.io) and [Apollo Client](https://www.apollographql.com/docs/angular). The generated code is [TypeScript](https://www.typescriptlang.org) (and HTML templates) and is fully human-readable, enabling ongoing development and hand crafting.

## Motivation

Opinionate was created as an attempt to address the issue that, although modern frameworks like Angular and technologies like GraphQL offer a lot of power and flexibility, and tools like the Angular CLI provide some shortcuts, it still seems that a lot of boilerplate code is required to build a full stack application. By making some assumptions (which are arguably opinionated), a lot of boilerplate code can be generated automatically. Even if some of the code is inappropriate or requires further development, it might still save a lot of time. Hopefully also, it might often be more efficient to refine the code generation/tool, rather than hand work the code afterwards.

## Prerequisites

- install [Node.js](https://nodejs.org/en)
- install [PostgreSQL](https://www.postgresql.org)
- optionally install a good IDE with TypeScript support, e.g. [VS Code](https://code.visualstudio.com)
- optionally install Yarn (rather than using NPM)

## Example installation

- clone the repository `git clone https://github.com/tjme/opinionate.git opinionate`
- change to your project directory `cd opinionate`
- create/configure a PostgreSQL database, e.g. "toh" `sudo -u postgres psql -d template1`, then enter the following SQL commands:

```sql
CREATE USER test WITH PASSWORD 'testpass';
\c toh
\i src/models/toh.pgsql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO test;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO test;
\q
```

- install PostGraphile globally `yarn global add postgraphile` (or `npm -g i postgraphile`)
- generate a JSON schema file `postgraphile -c postgres://test:testpass@/toh -s public -X --export-schema-json src/models/schema.json` (and optionally also a GraphQL schema, by appending `--export-schema-graphql src/models/schema.gql`)
- run the GraphQL server (in the background) with `postgraphile -c postgres://test:testpass@/toh -s public -o &`
- optionally you can click on the link to GraphiQL generated by the above, and explore the server by entering queries such as: `{allHeroes{nodes{nodeId,id,name}}}`
- install the dependencies with `yarn` (or `npm i`)
- run `yarn run gentypes` to generate the TypeScript definitions of all GraphQL types
- run `yarn run gencode` to automatically (re)generate fully functional List and CRUD components/pages for each GraphQL node/entity, as well as common items (including app.module.ts and app-routing.,odule.ts). It will replace previously generated code without warning (but will not automatically remove any components no longer present, so you may want to first remove all generated code with `yarn run gencodeclean`)
- install angular CLI globally (you may need elevated privileges, e.g. prefix with sudo) `yarn global add @angular/cli`
- if using yarn, configure `ng set --global packageManager=yarn`
- run the Angular server `ng serve --open`
- the front-end should open automatically in your browser, and you should be able to list, add, update and delete heroes that are then stored (persistently) in the database
- if may want to use the Angular CLI to further build, develop and test, then use `ng help` or refer to the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md)
- you can restore the database, with its initial sample data, by re-running the toh.pgsql script

## Issues

The automated code generation does not currently cater correctly for fields that should be automatically populated on creation (such as the Hero ID). This can be manually fixed by removing ! from "mutation create($id:Int!" in src/app/crud/hero.type.ts.

The generated front-end is currently very basic, both in form and function. Though it is more straightforward to address the former through manually added theming and CSS styling, the latter should be addressed in susequent releases, through deeper introspection (e.g. to support linking between entities), and perhaps through additional direction in the form of schema annotations/directives.

Note that though the GraphQL Code Generator is currently used, it seems more geared toward generation of back-end code, and some special concessions have had to be made for it (e.g. list and crud component file names including .type, and having to implement logic as Handlebars helpers). Future releases may use alternative methods (e.g. ES6 templates).

Any feedback would be gratefully recieved!

Thanks,
tim@merrison.co.uk