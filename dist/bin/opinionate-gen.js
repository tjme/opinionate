"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGen = void 0;
const commander = require("commander");
const generate_1 = require("../generate");
class AppGen {
    constructor() {
        this.program = commander;
        this.package = require('../../package.json');
    }
    initialize() {
        this.program
            .version(this.package.version)
            .option("-t, --template <dir>", "folder from which to fetch the template(s)", "./template")
            .option("-w, --target <dir>", "folder in which to write the generated code file(s)", "./")
            .option("-s, --schema <file>", "JSON file to read (base) schema from", "models/schema.json")
            .option("-o, --overlay <file>", "JSON file to read, defining additions to the schema.data.__schema.types (especially metadata)")
            .option("-d, --default-meta <file>", "ES6 template file defining the metadata structure and default values (used for each type, in the absence of any other sources)")
            .option("-f, --config-key <key>", "key of the config structure node in the above file")
            .option("-k, --default-meta-key <key>", "key of the metadata structure node in the above file")
            .option("-e, --eval-exclude-files", " a regex to match any filenames to be excluded from eval (e.g. to exclude defaultMeta)")
            .parse(process.argv);
        const options = this.program.opts();
        if (options.debug)
            console.log(options);
        generate_1.generate(this.program.template, this.program.target, this.program.schema, this.program.overlay, this.program.defaultMeta, this.program.configKey, this.program.defaultMetaKey, this.program.evalExcludeFiles);
        process.exit();
    }
}
exports.AppGen = AppGen;
let app = new AppGen();
app.initialize();
