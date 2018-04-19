import * as fs from 'fs';

export class Opinionate {

  public op(schemaPath = "./src/models/schema.json") {
    const schema = fs.readFileSync(schemaPath);
    console.log(JSON.stringify(schema));
  }

}
