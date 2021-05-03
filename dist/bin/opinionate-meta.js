"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppMetaMerge = void 0;
const commander = require("commander");
const generate_1 = require("../generate");
class AppMetaMerge {
    constructor() {
        this.program = commander;
        this.package = require('../../package.json');
    }
    initialize() {
        this.program
            .version(this.package.version)
            .option("-s, --schema <file>", "JSON file to read (base) schema from", "models/schema.json")
            .option("-o, --overlay <file>", "JSON file to read, defining additions to the schema.data.__schema.types (especially metadata)")
            .option("-d, --default-meta <file>", "ES6 template file defining the metadata structure and default values (used for each type, in the absence of any other sources)")
            .option("-m, --schema-out <file>", "JSON file to write, defining schema with merged in metadata")
            .option("-v, --overlay-out <file>", "JSON file to write, defining additions to the schema (especially metadata, but including type IDs)")
            .option("-t, --comments-out <file>", "PostgreSQL script file to write, defining (enhanced) table and field comments")
            .option("-a, --allow-existing", "Allow the base schema to include metadata")
            .option("-c, --clean-descriptions", "Remove metadata from the descriptions")
            .option("-i, --ignore-comments", "Do not extract metadata from any comments in the base schema")
            .option("-r, --relaxed-structure", "don't limit to just the structure specified in the default metadata")
            .option("-n, --no-dequote", "don't try to remove quotes from values that shouldn't normally be quoted (e.g. null)")
            .option("-z, --return-overlay", "return only the merged overlay, rather than the full merged schema")
            .parse(process.argv);
        if (typeof this.program.schema !== 'string')
            throw new Error(`No schema file supplied`);
        generate_1.metaMerge(this.program.schema, this.program.overlay, this.program.defaultMeta, this.program.schemaOut, this.program.overlayOut, this.program.commentsOut, this.program.allowExisting, this.program.cleanDescriptions, this.program.ignoreComments, this.program.relaxedStructure);
        process.exit();
    }
}
exports.AppMetaMerge = AppMetaMerge;
let app = new AppMetaMerge();
app.initialize();
