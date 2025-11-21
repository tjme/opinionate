import * as fs from "fs";
import { plural as _plural, singular as _singular } from "pluralize";

const metaProp = "meta", metaMarker = "@meta", separator = "\n", entityFilename = "_ENTITIES_";

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Safely get the value of a property/path, without raising an exception if (any part of) the path does not exist
 * @param obj the object from which to safely get the value
 * @param key the key of the property/path required
 */
function get(obj: any, key: string) {
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
function merge(target: any, relaxed = false, ...sources: any[]): any {
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
function stringify(ob: any): string {
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
function convert(ob: string): string {
  return (ob.trim().startsWith("{") ? "" : "{")+ob
  .replace(/^\((.*)\)$/g,'$1').replace(/^\"(.*)\"$/g,'$1').replace(/^\{(.*)\}$/g,'$1') // Remove any outer brackets and/or double quotes and/or curly brackets
	.replace(/:\s*"([^"]*)"/g, function(match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
	.replace(/:\s*'([^']*)'/g, function(match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
	.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
	.replace(/@colon@/g, ':')+(ob.trim().endsWith("}") ? "" : "}")
}

/**
 * Convert to Proper case (initial capital, followed by all lower case)
 * @param txt the string to convert
 */
function toProperCase(txt: string): string {
  return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(); }

/**
 * Convert the first character to lower case (initial lower case, followed by remainder unchanged)
 * @param txt the string to convert
 */
function to1LowerCase(txt: any): string {
  return txt.charAt(0).toLowerCase() + txt.slice(1) }

/**
 * Convert the first character to upper case (initial upper case, followed by remainder unchanged)
 * @param txt the string to convert
 */
function to1UpperCase(txt: string): string {
  return txt.charAt(0).toUpperCase() + txt.slice(1); }

/**
 * Convert camelCase to proper (case, space separated) words
 * @param txt the camelCase string to convert
 */
function camel2proper(camelCase: string) {
  return camelCase
  .replace(/([A-Z])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase())
  .trim() }

function isEntity(entity: any): boolean {
  return entity.kind == "OBJECT"
    && entity.name !== "Query" && entity.name !== "Mutation" && entity.name !== "PageInfo" && !entity.name.startsWith("__")
    && !entity.name.endsWith("Connection") && !entity.name.endsWith("Edge") && !entity.name.endsWith("Payload") }

function isField(field: any): boolean {
  return field.type && (["SCALAR","ENUM"].includes(field.type.kind) || (field.type["ofType"] && field.type.ofType["kind"] == "SCALAR")) }

function getType(field: any): string {
  return isField(field) && field.type && (field.type.name || (field.type.ofType && field.type.ofType.name)) }

function isType(field: any, type: string): boolean { return (getType(field) === type) }

/**
 * Facilities to merge and/or convert schema metadata, from and to various sources and file formats
 * @param schemaInPath base schema JSON filename to load from (which may already contain some metadata)
 * @param overlayInPath then merge in any schema.data.__schema.types metadata from overlay JSON file (containing metadata and type IDs)
 * @param defaultMeta an ES6 template file defining the default metadata (used for each type, in the absence of any other sources)
 * @param defaultMetaKey default metadata key within the above
 * then also merge in any metadata from its entity and field descriptions (originally from PostgreSQL table and field comments)
 * Write merged results to any of the following output files:
 * @param schemaOutPath to updated schema JSON file (which can subsequently be used as new base schema)
 * @param overlayOutPath for schema.data.__schema.types, to JSON file with just metadata (and identifying type IDs)
 * @param commentsOutPath SQL script to add (or replace) table and field comments, including metadata
 * @param allowExisting whether metadata is allowed in base schema
 * @param cleanDescriptions whether to remove metadata from descriptions/comments
 * @param ignoreComments ignore any existing metadata in base schema comments
 * @param relaxedStructure don't limit to just the structure specified in the default metadata
 * @param dontEval don't try to evaluate the metadata structure as an ES6 template
 * @param dontDequote don't try to remove quotes from values that shouldn't normally be quoted (e.g. null)
 * @param dontRemoveNull don't remove null metadata entries
 * @param returnOverlay return only the merged overlay, rather than the full merged schema
 */
export function metaMerge(schemaInPath: string, overlayInPath?: string, defaultMeta: string = "./package.json", defaultMetaKey: string = "config.defaultMeta",
  schemaOutPath?: string, overlayOutPath?: string, commentsOutPath?: string,
  allowExisting = false, cleanDescriptions = false, ignoreComments = false, relaxedStructure = false,
  dontEval = false, dontDequote = false, dontRemoveNull = false, returnOverlay = false
): any {

  function plural(word: string): string { return _plural(word) }
  function singular(word: string): string { return _singular(word) }
  const es6MetaIn = JSON.stringify(get(JSON.parse(fs.readFileSync(defaultMeta).toString()), defaultMetaKey));

  function mergeMeta(item: any[any], overlay: any[], parent?: any) {
    let es6Meta = dontEval ? es6MetaIn : eval("`"+es6MetaIn+"`");
    if (relaxedStructure) es6Meta = convert(es6Meta);
    let tempMeta = JSON.parse(es6Meta);
    if (!dontDequote) {
      tempMeta = Object.fromEntries(
        Object.entries(tempMeta).map(([ key, val ]) => [ key,
          val === "null" ? null :
          val === "true" ? true :
          val === "false" ? false :
          val === "undefined" ? undefined :
          val
        ])
      );
    }
    if (!dontRemoveNull) tempMeta = Object.fromEntries(Object.entries(tempMeta).filter(([ key, val ]) => val !== null));
    item[metaProp] = tempMeta;
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
  if (!schema.data) schema = { "data": schema }; // adjust for non PostGraphile structures, e.g. MusicBrainz
  const overlayIn = overlayInPath && JSON.parse(fs.readFileSync(overlayInPath).toString());
  const types = schema.data.__schema.types;
  types
  .filter((ft: any) => isEntity(ft))
  .forEach((t: any) => {
    if (!allowExisting && t.hasOwnProperty(metaProp)) throw new Error(`The schema already contains metadata (for table ${t.name})`);
    mergeMeta(t, overlayIn);
    t.fields
    // .filter((f: any) => isField(f))
    .forEach((f: any) => {
      if (!allowExisting && f.hasOwnProperty(metaProp)) throw new Error(`The schema already contains metadata (for field ${f.name})`);
      mergeMeta(f, overlayIn && overlayIn.find((oi: any) => oi.name == t.name).fields, t);
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
 * @param defaultMetaKey default metadata key within the above
 * then also merge in any metadata from its entity and field descriptions (originally from PostgreSQL table and field comments)
 * @param evalExcludeFiles a regex to match any filenames to be excluded from eval
 */
export function generate(templateDir: string, targetDir: string, schemaInPath: string,
  overlayInPath?: string, defaultMeta: string = "./package.json", defaultMetaKey: string = "config.defaultMeta",
  evalExcludeFiles: RegExp = /package.*\.json/): void {

  function plural(word: string): string { return _plural(word) }
  function singular(word: string): string { return _singular(word) }
  const schema = metaMerge(schemaInPath, overlayInPath, defaultMeta, defaultMetaKey);
  const types = schema.data.__schema.types;
  const entities = types.filter((f: any) => isEntity(f) && f[metaProp] && f[metaProp].templates && (f[metaProp].templates.length > 1 || f[metaProp].templates[0] != ""));

  function genCore(templateDir: string, targetDir: string) {
    fs.readdirSync(templateDir).forEach((targetName: string) => {
      if (fs.statSync(templateDir + "/" + targetName).isDirectory()){
        try {fs.mkdirSync(targetDir + "/" + targetName)} catch (err) {if (err.code !== 'EEXIST') throw err}
        genCore(templateDir + "/" + targetName, targetDir + "/" + targetName);
      } else {
        const templateContent = "`" + fs.readFileSync(templateDir + "/" + targetName) + "`";
        if (targetName.includes(entityFilename)) {
          entities.map((entity: any) => {
            fs.writeFileSync(targetDir + "/" + targetName.replace(entityFilename, entity.name).toLowerCase(), eval(templateContent));
          })
        } else fs.writeFileSync(targetDir + "/" + targetName, evalExcludeFiles.test(targetName) ? templateContent : eval(templateContent));
      }
    });
  }

  genCore(templateDir, targetDir);
}
