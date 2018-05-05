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
      // .option("-s, --schema <file>", "JSON file to read (base) schema from", "./src/models/schema.json")
      // .option("-o, --overlay <file>", "JSON file to read, defining additions to the schema (especially metadata)")
      // .option("-m, --schema-out <file>", "JSON file to write, defining schema with merged in metadata")
      // .option("-v, --overlay-out <file>", "JSON file to write, defining additions to the schema (especially metadata)")
      // .option("-t, --comments-out <file>", "PostGreSQL script, defining (enhanced) table and field comments")
      // .option("-a, --allow-existing", "Allow the base schema to include metadata")
      // .option("-c, --clean-descriptions", "Remove metadata from the descriptions")
      .parse(process.argv);

    // if (typeof this.program.schema !== 'string') throw new Error(`No schema file supplied`);

    generate(
      // this.program.schema,
      // this.program.overlay,
      // this.program.schemaOut,
      // this.program.overlayOut,
      // this.program.commentsOut,
      // this.program.allowExisting,
      // this.program.cleanDescriptions
    );

    process.exit();
  }

}

let app = new AppGen();
app.initialize();
