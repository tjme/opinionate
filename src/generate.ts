import * as fs from "fs";
import * as _pluralize from 'pluralize';
import { metaMerge } from './schema-meta';

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
