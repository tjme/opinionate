import * as fs from "fs";
import * as _pluralize from 'pluralize';
import { metaMerge } from './schema-meta';
import { STATUS_CODES } from "http";

/**
 * Generate front-end components from schema intraspection and/or metadata
 * @param templateDir the folder (structure) from which to (recursively) fetch the (ES6) templates
 * @param targetDir the folder in which to write the generated code files
 */
export function generate(templateDir: string, targetDir: string): void {

  function pluralize(word: string) { return _pluralize.plural(word) };
  function isEntity(entity: any): boolean { return entity.hasOwnProperty("meta") };
  function isField(field: any): boolean { return field.hasOwnProperty("meta") };
  function isType(field: any, type: string): boolean { 
    return (field.type && field.type.name && field.type.name === type)
    || (field.type.ofType && field.type.ofType.name && field.type.ofType.name === type) };

  const schema = metaMerge("./src/models/schema.json");
  const types = schema.data.__schema.types.filter((f: any) => isEntity(f));

  fs.readdirSync(templateDir).forEach((targetName: string) => {
    if (fs.statSync(templateDir + "/" + targetName).isDirectory()){
      try {fs.mkdirSync(targetDir + "/" + targetName)} catch (err) {if (err.code !== 'EEXIST') throw err}
      generate(templateDir + "/" + targetName, targetDir + "/" + targetName);
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

// For test purposes; Todo: remove or comment-out:
// generate("./test/template", "../i2k-opinionate/src/app");
