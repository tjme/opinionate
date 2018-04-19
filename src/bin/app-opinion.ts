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
            .option('-o, --opine [value]', 'Say opinionate!')
            .parse(process.argv);

        if (this.program.opine != null) {

            if (typeof this.program.opine !== 'string') {
                this.opinionate.write();
            } else {
                this.opinionate.write(this.program.opine);
            }

            process.exit();
        }

        this.program.help();
    }

}

let app = new Opinion();
app.initialize();
