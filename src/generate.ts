import * as fs from "fs";
import * as _pluralize from 'pluralize';
import { metaMerge } from './schema-meta';

/**
 * Generate front-end components from schema intraspection and/or metadata
 * @param templateDir the folder (structure) from which to (recursively) fetch the (ES6) templates
 * @param targetDir the folder in which to write the generated code files
 */
export function generate(templateDir = "./test/template", targetDir = "./test/app"): void {
  const {schema, overlay} = metaMerge("./src/models/schema.json", "./src/models/overlay.json");

  function pluralize(word: string) { return _pluralize.plural(word) }
  
  fs.readdirSync(templateDir).forEach((targetName: string) => {
    if (fs.statSync(templateDir + "/" + targetName).isDirectory()){
      try {fs.mkdirSync(targetDir + "/" + targetName)} catch (err) {if (err.code !== 'EEXIST') throw err}
      generate(templateDir + "/" + targetName, targetDir + "/" + targetName);
    } else {
      const templateContent = "`" + fs.readFileSync(templateDir + "/" + targetName) + "`";
      if (targetName.includes("types")) {
        overlay.map((types: any) => {
          fs.writeFileSync(targetDir + "/" + targetName.replace("types", types.name).toLowerCase(), eval(templateContent));
        })
      } else fs.writeFileSync(targetDir + "/" + targetName, eval(templateContent));
    }
  });
}

// Todo: for test purposes; remove later:
// generate();
