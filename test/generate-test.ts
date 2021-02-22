import { generate } from "../src/generate";

const schema = generate(
  "./test/template", // templateDir
  "./test/app", // targetDir
  "./src/models/schema.json", // schemaInPath
  // overlayInPath
  // defaultMeta
);
