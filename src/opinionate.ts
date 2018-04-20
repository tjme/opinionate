import * as fs from "fs";
import { isObject, mergeDeep } from "./bin/utils";

export class Opinionate {

  public op(schemaPath = "./src/models/schema.json", overlayPath = "") {
    let schema = JSON.parse(fs.readFileSync(schemaPath).toString());
    console.log(`Base=${schema}`);
    if (overlayPath !== "") schema = mergeDeep(schema, JSON.parse(
      "{\"schema\": {\"data\": {\"__schema\": {\"types\": "+fs.readFileSync(overlayPath).toString()+"}}}}"));
    console.log("Type, with overlay=", schema.data.__schema.types);
    // console.log(`With overlay=${schema}`);
  }

}
