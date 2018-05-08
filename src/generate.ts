import * as fs from "fs";
import { metaMerge } from './schema-meta';

/**
 * Generate front-end components from schema intraspection and/or metadata
 * @param templateDir the folder (structure) from which to (recursively) fetch the (ES6) templates
 * @param targetDir the folder in which to write the generated code files
 */
export function generate(templateDir = "./test/template", targetDir = "./test/app"): void {
  const {schema, overlay} = metaMerge("./src/models/schema.json", "./src/models/overlay.json");
  
  fs.readdirSync(templateDir).forEach((name: string) => {
    if (fs.statSync(templateDir + "/" + name).isDirectory()){
      try {fs.mkdirSync(targetDir + "/" + name)} catch (err) {if (err.code !== 'EEXIST') throw err}
      generate(templateDir + "/" + name, targetDir + "/" + name);
    } else {
      fs.writeFileSync(targetDir + "/" + name,
      eval("`" + fs.readFileSync(templateDir + "/" + name) + "`"));
    }
  });
}

// Todo: for test purposes; remove later:
// generate();
