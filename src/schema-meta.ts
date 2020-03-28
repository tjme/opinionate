import * as fs from "fs";
import { merge, stringify, convert } from "./utils";

const metaProp = "meta", metaMarker = "@meta", separator = "\n";

/**
 * Facilities to merge and/or convert schema metadata, from and to various sources and file formats
 * @param schemaInPath base schema JSON filename to load from (which may already contain some metadata)
 * @param overlayInPath then merge in any schema.data.__schema.types metadata from overlay JSON file (containing metadata and type IDs)
 * Write merged results to any of the following output files:
 * @param defaultMeta an ES6 template string defining the default metadata (used for each type, in the absence of any other sources)
 * then also merge in any metadata from its entity and field descriptions (originally from PostgreSQL table and field comments)
 * @param schemaOutPath to updated schema JSON file (which can subsequently be used as new base schema)
 * @param overlayOutPath for schema.data.__schema.types, to JSON file with just metadata (and identifying type IDs)
 * @param commentsOutPath SQL script to add (or replace) table and field comments, including metadata
 * @param allowExisting whether metadata is allowed in base schema
 * @param cleanDescriptions whether to remove metadata from descriptions/comments
 * @param ignoreComments ignore any existing metadata in base schema comments
 * @param relaxedStructure don't limit to just the structure specified in the default metadata
 * @param returnOverlay return only the merged overlay, rather than the full merged schema
 */
export function metaMerge(schemaInPath: string, overlayInPath?: string, defaultMeta?: string,
  schemaOutPath?: string, overlayOutPath?: string, commentsOutPath?: string,
  allowExisting = false, cleanDescriptions = false, ignoreComments = false, relaxedStructure = false, returnOverlay = false
): any {

  function mergeMeta(item: any, overlay: any[]) {
    // Define meta to match GraphQL:
    // directive @meta(label: String, readonly: Boolean = false, templates: [String] = ["list", "crud"]) on OBJECT | FIELD_DEFINITION
    const es6Meta = "`" + ((defaultMeta && fs.readFileSync(defaultMeta).toString()) || '{ label: "${utils.toProperCase(item.name)}", readonly: false, templates: ["list", "crud"] }') + "`";
    item[metaProp] = JSON.parse(convert(eval(es6Meta)));
    if (item.description) {
      const [description, meta] = item.description.split(metaMarker);
      if (meta && !ignoreComments) { item[metaProp] = merge(item[metaProp], relaxedStructure, JSON.parse(convert(meta))); }
      if (cleanDescriptions) item.description = description ? item.description.split(separator+metaMarker)[0] : "";
    }
    if (overlay) {
      const overlayItem = overlay.find((oi: any) => oi.name == item.name)
      if (overlayItem && overlayItem[metaProp]) item[metaProp] = merge(item[metaProp], relaxedStructure, overlayItem[metaProp]);
    }
  };

  // Return a comment string, suitable for PostgreSQL tables or fields
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
      mergeMeta(f, overlayIn && overlayIn.find((oi: any) => oi.name == t.name).fields);
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
