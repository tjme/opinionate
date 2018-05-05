import * as commander from 'commander';

export class App {

    private program: commander.CommanderStatic;
    private package: any;

    constructor() {
        this.program = commander;
        this.package = require('../../package.json');
    }

    public initialize() {
        this.program
            .version(this.package.version)
            .command('meta [options]', 'merge and/or convert schema metadata, from and to various sources and file formats')
            .command('gen [options]', 'generate front-end components from schema intraspection and/or metadata', {isDefault: true})
            // .command('write [message]', 'say hello!')
            .parse(process.argv);
    }

}

let app = new App();
app.initialize();
