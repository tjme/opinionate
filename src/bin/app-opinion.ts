import * as commander from 'commander';
import { Opinionate } from '../opinionate';

export class Opinion {

    private program: commander.CommanderStatic;
    private package: any;
    private opinionate: Opinionate;

    constructor() {
        this.program = commander;
        this.package = require('../../package.json');
        this.opinionate = new Opinionate();
    }

    public initialize() {
        this.program
            .version(this.package.version)
            .option('-s, --schemaPath [value]', 'JSON file defining schema')
            .option('-o, --overlayPath [value]', 'JSON file defining additions to the schema')
            .parse(process.argv);

        // if (this.program.schemaPath != null) {

        //     if (typeof this.program.schemaPath !== 'string') {
        //         this.opinionate.op();
        //     } else {
                this.opinionate.op(this.program.schemaPath, this.program.overlayPath);
            // }

            process.exit();
        // }

        // this.program.help();
    }

}

let app = new Opinion();
app.initialize();
