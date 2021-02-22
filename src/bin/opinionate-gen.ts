import * as commander from 'commander';
import { generate } from '../generate';

export class AppGen {

  private program: commander.CommanderStatic;
  private package: any;

  constructor() {
    this.program = commander;
    this.package = require('../../package.json');
  }

  public initialize() {
    this.program
      .version(this.package.version)
      .option("-t, --template <dir>", "folder from which to fetch the template(s)", "./template")
      .option("-w, --target <dir>", "folder in which to write the generated code file(s)", "./")
      .option("-s, --schema <file>", "JSON file to read (base) schema from", "../models/schema.json")
      .option("-o, --overlay <file>", "JSON file to read, defining additions to the schema.data.__schema.types (especially metadata)")
      .option("-d, --default-meta <file>","ES6 template file defining the default metadata (used for each type, in the absence of any other sources)")
      .parse(process.argv);

    // if (typeof this.program.target !== 'string') throw new Error(`No target folder specified`);

    generate(
      this.program.template,
      this.program.target,
      this.program.schema,
      this.program.overlay,
      this.program.defaultMeta
    );

    process.exit();
  }

}

let app = new AppGen();
app.initialize();
