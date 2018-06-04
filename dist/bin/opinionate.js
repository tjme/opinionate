"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
class App {
    constructor() {
        this.program = commander;
        this.package = require('../../package.json');
    }
    initialize() {
        this.program
            .version(this.package.version)
            .command('meta [options]', 'merge and/or convert schema metadata, from and to various sources and file formats')
            .command('gen [options]', 'generate front-end components from schema intraspection and/or metadata', { isDefault: true })
            .parse(process.argv);
    }
}
exports.App = App;
let app = new App();
app.initialize();
