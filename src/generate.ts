// Generate front-end components from schema intraspection and/or metadata

import * as fs from "fs";
import { metaMerge } from './schema-meta';

export function generate(templateDir = "./test/template", targetDir = "./test/app"): void {
  const {schema, overlay} = metaMerge("./src/models/schema.json", "./src/models/overlay.json");

  function replaceOverlay(match: string, p1: string): string { return overlay.map((types: any) => eval("`"+p1+"`")).join("\n"); }
  
  fs.readdirSync(templateDir).forEach((name: string) => {
    if (fs.statSync(templateDir + "/"+ name).isDirectory()){
      try {fs.mkdirSync(targetDir + "/" + name)} catch (err) {if (err.code !== 'EEXIST') throw err}
      generate(templateDir + "/"+ name, targetDir + "/"+ name);
    } else {
      fs.writeFileSync(targetDir + "/" + name,
      fs.readFileSync(templateDir + "/" + name).toString()
      .replace(/\${OVERLAY}([\s\S]*?)\${}/g, replaceOverlay));
    }
  });
}

// Todo: for test purposes; remove later:
generate();
