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
            .option("-w, --target <dir>", "folder in which to write the generated code file(s)", "./src/app")
            .option("-s, --schema <file>", "JSON file to read (base) schema from", "../models/schema.json")
            .option("-o, --overlay <file>", "JSON file to read, defining additions to the schema.data.__schema.types (especially metadata)")
            .option("-d, --default-meta <string>", "ES6 template string defining the default metadata (used for each type, in the absence of any other sources)")
            .parse(process.argv);
        generate_1.generate(this.program.template, this.program.target, this.program.schema, this.program.overlay, this.program.defaultMeta);
        process.exit();
    }
}
exports.AppGen = AppGen;
let app = new AppGen();
app.initialize();
