import * as commander from 'commander';
import { metaMerge } from '../generate';
export class AppMetaMerge {

  private program: commander.CommanderStatic;
  private package: any;
  constructor() {
    this.program = commander;
    this.package = require('../../package.json');
  }
  public initialize() {
    this.program
      .version(this.package.version)
      .option("-s, --schema <file>", "JSON file to read (base) schema from", "models/schema.json")
      .option("-o, --overlay <file>", "JSON file to read, defining additions to the schema.data.__schema.types (especially metadata)")
      .option("-d, --default-meta <file>","ES6 template file defining the metadata structure and default values (used for each type, in the absence of any other sources)")
      .option("-f, --config-key <key>", "key of the config structure node in the above file")
      .option("-k, --default-meta-key <key>","key of the metadata structure node in the above file")
      .option("-m, --schema-out <file>", "JSON file to write, defining schema with merged in metadata")
      .option("-v, --overlay-out <file>", "JSON file to write, defining additions to the schema (especially metadata, but including type IDs)")
      .option("-t, --comments-out <file>", "PostgreSQL script file to write, defining (enhanced) table and field comments")
      .option("-a, --allow-existing", "Allow the base schema to include metadata")
      .option("-c, --clean-descriptions", "Remove metadata from the descriptions")
      .option("-i, --ignore-comments", "Do not extract metadata from any comments in the base schema")
      .option("-r, --relaxed-structure", "don't limit to just the structure specified in the default metadata")
      .option("-e, --dont-eval", "don't try to evaluate the metadata structure as an ES6 template in the above")
      .option("-q, --dont-dequote", "don't try to remove quotes from values that shouldn't normally be quoted (e.g. null)")
      .option("-n, --dont-remove-null", "don't remove null metadata entries")
      .option("-z, --return-overlay", "return only the merged overlay, rather than the full merged schema")
      .parse(process.argv);
      const options = this.program.opts();
      if (options.debug) console.log(options);
      if (typeof this.program.schema !== 'string') throw new Error(`No schema file supplied`);
    metaMerge(
      this.program.schema,
      this.program.overlay,
      this.program.defaultMeta,
      this.program.configKey,
      this.program.defaultMetaKey,
      this.program.schemaOut,
      this.program.overlayOut,
      this.program.commentsOut,
      this.program.allowExisting,
      this.program.cleanDescriptions,
      this.program.ignoreComments,
      this.program.relaxedStructure,
      this.program.dontEval,
      this.program.dontDequote,
      this.program.dontRemoveNull,
      this.program.returnOverlay
    );
    process.exit();
  }
}
let app = new AppMetaMerge();
app.initialize();
