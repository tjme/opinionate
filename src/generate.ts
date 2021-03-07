import * as fs from "fs";
import * as _pluralize from 'pluralize';

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Safely get the value of a property/path, without raising an exception if (any part of) the path does not exist
 * @param obj the object from which to safely get the value
 * @param key the key of the property/path required
 */
export function get(obj: any, key: string) {
  return key.split(".").reduce(function(o, x) {
    return (typeof o == "undefined" || o === null) ? o : o[x];
  }, obj);
}

/**
 * Deep merge an object with others.
 * @param target a base object
 * @param relaxed boolean flag indicating whether properties not already present in the target should be added
 * @param ...sources additional object(s) to be merged in
 * @returns {object} the merger of all input objects
 */
export function merge(target: any, relaxed = false, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (relaxed && !target.hasOwnPropert(key)) Object.assign(target, { [key]: {} });
        merge(target[key], relaxed, source[key]);
      } else {
        if (relaxed || (isObject(target) && target.hasOwnProperty(key))) Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, relaxed, ...sources);
}

/**
 * Similar to JSON.stringify, but without the quotes around object properties insisted on by strict JSON conformity
 * @param ob object to stringify
 * @returns {string} a "relaxed" string representation of an object
 */
export function stringify(ob: any): string {
  if(typeof ob !== "object" || Array.isArray(ob)){ return JSON.stringify(ob); }
  let props = Object
    .keys(ob)
    .map(key => `${key}:${stringify(ob[key])}`);
  return `${props}`; };

/**
 * Convert/clean relaxed object representations (including GraphQL) to strict JSON, allowing further processing, e.g. with JSON.parse
 * @param ob the object to convert to strict JSON
 * @returns {string}
 */
export function convert(ob: string): string {
  return "{"+ob
  .replace(/^\((.*)\)$/g,'$1').replace(/^\"(.*)\"$/g,'$1').replace(/^\{(.*)\}$/g,'$1') // Remove any outer brackets and/or double quotes and/or curly brackets
	.replace(/:\s*"([^"]*)"/g, function(match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
	.replace(/:\s*'([^']*)'/g, function(match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
	.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
	.replace(/@colon@/g, ':')+"}"
}

/**
 * 
 * @param txt the string to convert to Proper case (initial capital, followed by all lower case)
 */
export function toProperCase(txt: string): string { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }

export function isEntity(entity: any): boolean {
  return entity.kind == "OBJECT" && entity.name !== "Query" && entity.interfaces.length > 0 && entity.interfaces[0].name == "Node" }

export function isField(field: any): boolean {
  return field.name !== "nodeId" && field.type && (field.type.kind == "SCALAR" || (field.type["ofType"] && field.type.ofType["kind"] == "SCALAR")) }

export function getType(field: any): string { return isField(field) && (field.type.name || (field.type.ofType && field.type.ofType.name)) }

const metaProp = "meta", metaMarker = "@meta", separator = "\n";

/**
 * Facilities to merge and/or convert schema metadata, from and to various sources and file formats
 * @param schemaInPath base schema JSON filename to load from (which may already contain some metadata)
 * @param overlayInPath then merge in any schema.data.__schema.types metadata from overlay JSON file (containing metadata and type IDs)
 * Write merged results to any of the following output files:
 * @param defaultMeta an ES6 template file defining the default metadata (used for each type, in the absence of any other sources)
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
    const es6Meta = "`" + ((defaultMeta && fs.readFileSync(defaultMeta).toString()) ||
      `
        label: "${toProperCase(item.name)}",
        format: "${['money','money!'].includes(getType(item)) ? 'currency' : ['Boolean','Boolean!'].includes(getType(item)) ? 'boolean' : ['Datetime','Datetime!'].includes(getType(item)) ? 'date' : ['Int','Int!','BigInt','BigInt!','Float','Float!','BigFloat','BigFloat!'].includes(getType(item)) ? 'number' : 'string'}",
        required: ${getType(item) && '!'==getType(item).slice(-1) ? true : false},
        validation: null,
        align: "${['money','money!','Datetime','Datetime!','Int','Int!','BigInt','BigInt!','Float','FLoat!','BigFloat','BigFLoat!'].includes(getType(item)) ? 'right' : 'left'}",
        attributes: null,
        readonly: false,
        templates: ["switchboard","list", "crud"]
      `) + "`";
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
  .filter((ft: any) => isEntity(ft))
  .forEach((t: any) => {
    if (!allowExisting && t.hasOwnProperty(metaProp)) throw new Error(`The schema already contains metadata (for table ${t.name})`);
    mergeMeta(t, overlayIn);
    t.fields
    .filter((f: any) => isField(f))
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

/**
 * Generate front-end components from schema intraspection and/or metadata
 * @param templateDir the folder (structure) from which to (recursively) fetch the (ES6) templates
 * @param targetDir the folder in which to write the generated code files
 * @param schemaInPath base schema JSON filename to load from (which may already contain some metadata)
 * @param overlayInPath then merge in any schema.data.__schema.types metadata from overlay JSON file (containing metadata and type IDs)
 * @param defaultMeta an ES6 template file defining the default metadata (used for each type, in the absence of any other sources)
 * then also merge in any metadata from its entity and field descriptions (originally from PostgreSQL table and field comments)
 */
export function generate(templateDir: string, targetDir: string, schemaInPath: string, overlayInPath?: string, defaultMeta?: string): void {

  function pluralize(word: string) { return _pluralize.plural(word) };
  function getType(field: any): string { return (field.type && field.type.name) || (field.type.ofType && field.type.ofType.name) };
  function isType(field: any, type: string): boolean { return (getType(field) === type) };
  function isEntity(entity: any): boolean { return entity.hasOwnProperty("meta") };
  function isField(field: any): boolean { return field.hasOwnProperty("meta") };
  
  const schema = metaMerge(schemaInPath, overlayInPath, defaultMeta);
  const types = schema.data.__schema.types.filter((f: any) => isEntity(f));

  fs.readdirSync(templateDir).forEach((targetName: string) => {
    if (fs.statSync(templateDir + "/" + targetName).isDirectory()){
      try {fs.mkdirSync(targetDir + "/" + targetName)} catch (err) {if (err.code !== 'EEXIST') throw err}
      generate(templateDir + "/" + targetName, targetDir + "/" + targetName, schemaInPath, overlayInPath, defaultMeta);
    } else {
      const templateContent = "`" + fs.readFileSync(templateDir + "/" + targetName) + "`";
      if (targetName.includes("types")) {
        types.map((types: any) => {
          fs.writeFileSync(targetDir + "/" + targetName.replace("types", types.name).toLowerCase(), eval(templateContent));
        })
      } else fs.writeFileSync(targetDir + "/" + targetName, eval(templateContent));
    }
  });
}
