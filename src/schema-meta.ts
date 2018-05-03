import * as fs from "fs";

const metaProp = "meta", metaMarker = "@meta";

function toProperCase(txt: string): string { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }

export type meta = { label: string, list: boolean, crud: boolean };

/**
 * 
 * @param schemaInPath to base schema JSON file to load from (which may already contain some metadata)
 * then also merge in any metadata from its entity and field descriptions (originally from PostGreSQL table and field comments)
 * @param overlayInPath then merge in any metadata from overlay JSON file (containing metadata and IDs)
 * Write merged results to any of the following output files:
 * @param schemaOutPath to updated schema JSON file (which can subsequently be used as new base schema)
 * @param overlayOutPath to JSON file with just metadata (and identifying IDs)
 * @param commentsOutPath SQL script to add (or replace) table and field comments, including metadata
 * @param allowExisting whether metadata is allowed in base schema
 * @param cleanDescriptions whether to remove metadata from descriptions/comments
 */
export function getSchema(schemaInPath: string, overlayInPath?: string,
  schemaOutPath?: string, overlayOutPath?: string, commentsOutPath?: string,
  allowExisting = false, cleanDescriptions = false
): any {

  function metaMerge(item: any, overlay: any[]) {
    if (item.description) {
      const [description, meta] = item.description.split(metaMarker);
      if (meta) {
        item[metaProp] = JSON.parse(meta);
        if (cleanDescriptions) item.description = description ? item.description.split("\n"+metaMarker)[0] : "";
      }
    }
    if (overlay) {
      const overlayItem = Array.prototype.find((oi: any, undefined, o) => oi.name == item.name)
      if (overlayItem && overlayItem[metaProp]) item[metaProp] = overlayItem[metaProp];
    }
    if (!item[metaProp]) item[metaProp] = { label: toProperCase(item.name), list: true, crud: true };
  };

  function comment(description: string, meta: string): string {
    if (!meta) return description;
    const metaWithMarker = metaMarker+JSON.stringify(meta);
    if (!description) return metaWithMarker;
    description = description.split(metaMarker)[0];
    if (description.length == 0) return metaWithMarker;
    return description+"\n"+metaWithMarker;
  }
  
  let schema = JSON.parse(fs.readFileSync(schemaInPath).toString());
  const overlayIn = overlayInPath && JSON.parse(fs.readFileSync(schemaInPath).toString());
  schema.data.__schema.types
  .filter((ft: any) => ft.kind == "OBJECT" && ft.name !== "Query" && ft.interfaces.length > 0 && ft.interfaces[0].name == "Node")
  .forEach((t: any) => {
    if (!allowExisting && t.hasOwnProperty(metaProp)) throw new Error(`The schema already contains metadata (for table ${t.name})`);
    metaMerge(t, overlayIn);
    t.fields
    .filter((f: any) => f.name !== "nodeId" && (f.type.kind == "SCALAR" || (f.type["ofType"] && f.type.ofType["kind"] == "SCALAR")))
    .forEach((f: any) => {
      if (!allowExisting && f.hasOwnProperty(metaProp)) throw new Error(`The schema already contains metadata (for field ${f.name})`);
      metaMerge(f, overlayIn);
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
`COMMENT ON TABLE ${t.name} IS '${comment(t.description, t[metaProp])}';
`+t.fields.map((f: any) =>
`COMMENT ON COLUMN ${t.name}.${f.name} IS '${comment(f.description, f[metaProp])}';
`).join("")).join("\n"));
  return schema;
}

// Test getSchema:
// const schema = getSchema(
//   "./src/models/schema.json",
//   "./src/models/overlay.json",
//   "./src/models/schemaMerged.json",
//   "./src/models/overlayOut.json",
//   "./src/models/comments.pgsql",
// );
