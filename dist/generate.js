"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const fs = require("fs");
const _pluralize = require("pluralize");
const schema_meta_1 = require("./schema-meta");
function generate(templateDir, targetDir, schemaInPath, overlayInPath, defaultMeta) {
    function pluralize(word) { return _pluralize.plural(word); }
    ;
    function getType(field) { return (field.type && field.type.name) || (field.type.ofType && field.type.ofType.name); }
    ;
    function isType(field, type) { return (getType(field) === type); }
    ;
    function isEntity(entity) { return entity.hasOwnProperty("meta"); }
    ;
    function isField(field) { return field.hasOwnProperty("meta"); }
    ;
    const schema = schema_meta_1.metaMerge(schemaInPath, overlayInPath, defaultMeta);
    const types = schema.data.__schema.types.filter((f) => isEntity(f));
    fs.readdirSync(templateDir).forEach((targetName) => {
        if (fs.statSync(templateDir + "/" + targetName).isDirectory()) {
            try {
                fs.mkdirSync(targetDir + "/" + targetName);
            }
            catch (err) {
                if (err.code !== 'EEXIST')
                    throw err;
            }
            generate(templateDir + "/" + targetName, targetDir + "/" + targetName, schemaInPath, overlayInPath, defaultMeta);
        }
        else {
            const templateContent = "`" + fs.readFileSync(templateDir + "/" + targetName) + "`";
            if (targetName.includes("types")) {
                types.map((types) => {
                    fs.writeFileSync(targetDir + "/" + targetName.replace("types", types.name).toLowerCase(), eval(templateContent));
                });
            }
            else
                fs.writeFileSync(targetDir + "/" + targetName, eval(templateContent));
        }
    });
}
exports.generate = generate;
