"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
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
            .option("-b, --debug", "output extra debugging")
            .parse(process.argv);
        const options = this.program.opts();
        if (options.debug)
            console.log(options);
    }
}
exports.App = App;
let app = new App();
app.initialize();
