import { metaMerge } from "../src/schema-meta";

const schema = metaMerge(
  "./src/models/schema.json",
  undefined, //"./src/models/overlay.json",
  undefined,
  // '{ label: "${utils.toProperCase(item.name)}",\
  //    readonly: ${["created","lastupdated","operator"].includes(item.name)},\
  //    templates: [${!["created","lastupdated","operator","notes"].includes(item.name) ? "\\"list\\"," : ""} "crud"] }',
  undefined, //"./src/models/schemaMerged.json",
  undefined, //"./src/models/overlayOut.json",
  undefined, //"./src/models/comments.pgsql",
  undefined,
  undefined,
  undefined,
  undefined,
  undefined
);
