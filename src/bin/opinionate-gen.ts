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
      .option("-t, --templates <dir>", "folder from which to fetch the template(s)", "./test/template")
      .option("-w, --target <dir>", "folder in which to write the generated code file(s)", "./test/app")
      .parse(process.argv);

    // if (typeof this.program.target !== 'string') throw new Error(`No target folder specified`);

    generate(
      this.program.templates,
      this.program.target
    );

    process.exit();
  }

}

let app = new AppGen();
app.initialize();
