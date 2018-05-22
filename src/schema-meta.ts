import * as fs from "fs";

const metaProp = "meta", metaMarker = "@meta", separator = "\n";

export type meta = { label: string, list: boolean, crud: boolean };

// Return a "relaxed" string representation an object (with no double quotes around object properties)
export function stringify(ob: any): string {
  if(typeof ob !== "object" || Array.isArray(ob)){ return JSON.stringify(ob); }
  let props = Object
      .keys(ob)
      .map(key => `${key}:${stringify(ob[key])}`);
  return `${props}`; };

// "Clean" or convert relaxed object representations (including GraphQL) to strict JSON, allowing further processing, e.g. with JSON.parse
export function clean(ob: string): any {
  return ob
	.replace(/:\s*"([^"]*)"/g, function(match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
	.replace(/:\s*'([^']*)'/g, function(match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
	.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
	.replace(/@colon@/g, ':')
}

export function toProperCase(txt: string): string { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); };

/**
 * Facilities to merge and/or convert schema metadata, from and to various sources and file formats
 * @param schemaInPath to base schema JSON file to load from (which may already contain some metadata)
 * then also merge in any metadata from its entity and field descriptions (originally from PostGreSQL table and field comments)
 * @param overlayInPath then merge in any schema.data.__schema.types metadata from overlay JSON file (containing metadata and type IDs)
 * Write merged results to any of the following output files:
 * @param schemaOutPath to updated schema JSON file (which can subsequently be used as new base schema)
 * @param overlayOutPath to JSON file with just metadata (and identifying type IDs)
 * @param commentsOutPath SQL script to add (or replace) table and field comments, including metadata
 * @param allowExisting whether metadata is allowed in base schema
 * @param cleanDescriptions whether to remove metadata from descriptions/comments
 * @param returnOverlay return only the merged overlay, rather than the full merged schema
 */
export function metaMerge(schemaInPath: string, overlayInPath?: string,
  schemaOutPath?: string, overlayOutPath?: string, commentsOutPath?: string,
  allowExisting = false, cleanDescriptions = false, returnOverlay = false
): any {

  function mergeMeta(item: any, overlay: any[]) {
    if (item.description) {
      const [description, meta] = item.description.split(metaMarker);
      if (meta) {
        item[metaProp] = meta.replace(/^\(.*\)$/g,'$1').replace(/^\".*\"$/g,'$1'); // Removing any outer brackets and/or double quotes
        if (cleanDescriptions) item.description = description ? item.description.split(separator+metaMarker)[0] : "";
      }
    }
    if (overlay) {
      const overlayItem = overlay.find((oi: any) => oi.name == item.name)
      if (overlayItem && overlayItem[metaProp]) item[metaProp] = overlayItem[metaProp];
    }
    if (!item[metaProp]) item[metaProp] = { label: toProperCase(item.name), list: true, crud: true };
  };

  function comment(description: string, meta: string): string {
    if (!meta) return description;
    const metaWithMarker = metaMarker+'('+stringify(meta)+')';
    if (!description) return metaWithMarker;
    description = description.split(metaMarker)[0];
    if (description.length == 0) return metaWithMarker;
    return description+separator+metaWithMarker;
  }
  
  let schema = JSON.parse(fs.readFileSync(schemaInPath).toString());
  const overlayIn = overlayInPath && JSON.parse(fs.readFileSync(overlayInPath).toString());
  schema.data.__schema.types
  .filter((ft: any) => ft.kind == "OBJECT" && ft.name !== "Query" && ft.interfaces.length > 0 && ft.interfaces[0].name == "Node")
  .forEach((t: any) => {
    if (!allowExisting && t.hasOwnProperty(metaProp)) throw new Error(`The schema already contains metadata (for table ${t.name})`);
    mergeMeta(t, overlayIn);
    t.fields
    .filter((f: any) => f.name !== "nodeId" && (f.type.kind == "SCALAR" || (f.type["ofType"] && f.type.ofType["kind"] == "SCALAR")))
    .forEach((f: any) => {
      if (!allowExisting && f.hasOwnProperty(metaProp)) throw new Error(`The schema already contains metadata (for field ${f.name})`);
      mergeMeta(f, overlayIn.find((oi: any) => oi.name == t.name).fields);
    });
  });
  if (schemaOutPath) fs.writeFileSync(schemaOutPath, JSON.stringify(schema, null, 2));
  const overlayOut = schema.data.__schema.types
  .filter((ft: any) => ft.hasOwnProperty(metaProp))
  .map((m: any) => { return { name: m.name, description: m.description,
    fields: m.fields
    .filter((ff: any) => ff.hasOwnProperty(metaProp))
    .map((fm: any) => { return { name: fm.name, description: fm.description, meta: fm[metaProp] }}), meta: m[metaProp] }});
  if (overlayOutPath) fs.writeFileSync(overlayOutPath, JSON.stringify(overlayOut, null, 2));
  if (commentsOutPath) fs.writeFileSync(commentsOutPath, overlayOut.map((t: any) =>
`COMMENT ON TABLE ${t.name.toLowerCase()} IS '${comment(t.description, t[metaProp])}';
`+t.fields.map((f: any) =>
`COMMENT ON COLUMN ${t.name.toLowerCase()}.${f.name} IS '${comment(f.description, f[metaProp])}';
`).join("")).join("\n"));
  return schema;
}

// For test purposes; Todo: remove or comment-out:
// const schema = metaMerge(
//   "./src/models/schema.json",
//   "./src/models/overlay.json",
//   "./src/models/schemaMerged.json",
//   "./src/models/overlayOut.json",
//   "./src/models/comments.pgsql",
// );
