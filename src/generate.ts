// Generate front-end components from schema intraspection and/or metadata

import * as fs from "fs";
import { metaMerge } from './schema-meta';

export function generate(): void {
  const overlay = metaMerge("./src/models/schema.json", "./src/models/overlay.json", undefined, undefined, undefined, undefined, undefined, true);

  function replaceOverlay(match: string, p1: string): string { return overlay.map((types: any) => eval("`"+p1+"`")).join("\n"); }
  
  fs.writeFileSync("./test/app/app.module.ts",
  fs.readFileSync("./test/template/app.module.ts").toString()
  .replace(/\${OVERLAY}([\s\S]*?)\${}/g, replaceOverlay));
  
  fs.writeFileSync("./test/app/app-routing.module.ts",
  fs.readFileSync("./test/template/app-routing.module.ts").toString()
  .replace(/\${OVERLAY}([\s\S]*?)\${}/g, replaceOverlay));
  
  fs.writeFileSync("./test/app/app.component.html",
  fs.readFileSync("./test/template/app.component.html").toString()
  .replace(/\${OVERLAY}([\s\S]*?)\${}/g, replaceOverlay));
}

generate();