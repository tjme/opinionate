"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.metaMerge = void 0;
const fs = require("fs");
const pluralize_1 = require("pluralize");
const metaProp = "meta", metaMarker = "@meta", separator = "\n", entityFilename = "_ENTITIES_";
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
function get(obj, key) {
    return key.split(".").reduce(function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
}
function merge(target, relaxed = false, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (relaxed && !target.hasOwnPropert(key))
                    Object.assign(target, { [key]: {} });
                merge(target[key], relaxed, source[key]);
            }
            else {
                if (relaxed || (isObject(target) && target.hasOwnProperty(key)))
                    Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return merge(target, relaxed, ...sources);
}
function stringify(ob) {
    if (typeof ob !== "object" || Array.isArray(ob)) {
        return JSON.stringify(ob);
    }
    let props = Object
        .keys(ob)
        .map(key => `${key}:${stringify(ob[key])}`);
    return `${props}`;
}
;
function convert(ob) {
    return (ob.trim().startsWith("{") ? "" : "{") + ob
        .replace(/^\((.*)\)$/g, '$1').replace(/^\"(.*)\"$/g, '$1').replace(/^\{(.*)\}$/g, '$1')
        .replace(/:\s*"([^"]*)"/g, function (match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
        .replace(/:\s*'([^']*)'/g, function (match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
        .replace(/@colon@/g, ':') + (ob.trim().endsWith("}") ? "" : "}");
}
function toProperCase(txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
}
function to1LowerCase(txt) {
    return txt.charAt(0).toLowerCase() + txt.slice(1);
}
function to1UpperCase(txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1);
}
function camel2proper(camelCase) {
    return camelCase
        .replace(/([A-Z])/g, (match) => ` ${match}`)
        .replace(/^./, (match) => match.toUpperCase())
        .trim();
}
function isEntity(entity) {
    return entity.kind == "OBJECT" && entity.interfaces.length > 0
        && entity.name !== "Query" && entity.name !== "Mutation" && entity.name !== "PageInfo" && !entity.name.startsWith("__")
        && !entity.name.endsWith("Connection") && !entity.name.endsWith("Edge") && !entity.name.endsWith("Payload");
}
function isField(field) {
    return field.type && (field.type.kind == "SCALAR" || (field.type["ofType"] && field.type.ofType["kind"] == "SCALAR"));
}
function getType(field) {
    return isField(field) && field.type && (field.type.name || (field.type.ofType && field.type.ofType.name));
}
function isType(field, type) { return (getType(field) === type); }
function metaMerge(schemaInPath, overlayInPath, defaultMeta = "./package.json", defaultMetaKey = "config.defaultMeta", schemaOutPath, overlayOutPath, commentsOutPath, allowExisting = false, cleanDescriptions = false, ignoreComments = false, relaxedStructure = false, dontEval = false, dontDequote = false, dontRemoveNull = false, returnOverlay = false) {
    function plural(word) { return pluralize_1.plural(word); }
    function singular(word) { return pluralize_1.singular(word); }
    const es6MetaIn = JSON.stringify(get(JSON.parse(fs.readFileSync(defaultMeta).toString()), defaultMetaKey));
    function mergeMeta(item, overlay, parent) {
        let es6Meta = dontEval ? es6MetaIn : eval("`" + es6MetaIn + "`");
        if (relaxedStructure)
            es6Meta = convert(es6Meta);
        let tempMeta = JSON.parse(es6Meta);
        if (!dontDequote) {
            tempMeta = Object.fromEntries(Object.entries(tempMeta).map(([key, val]) => [key,
                val === "null" ? null :
                    val === "true" ? true :
                        val === "false" ? false :
                            val === "undefined" ? undefined :
                                val
            ]));
        }
        if (!dontRemoveNull)
            tempMeta = Object.fromEntries(Object.entries(tempMeta).filter(([key, val]) => val !== null));
        item[metaProp] = tempMeta;
        if (item.description) {
            const [description, meta] = item.description.split(metaMarker);
            if (meta && !ignoreComments) {
                item[metaProp] = merge(item[metaProp], relaxedStructure, JSON.parse(convert(meta)));
            }
            if (cleanDescriptions)
                item.description = description ? item.description.split(separator + metaMarker)[0] : "";
        }
        if (overlay) {
            const overlayItem = overlay.find((oi) => oi.name == item.name);
            if (overlayItem && overlayItem[metaProp])
                item[metaProp] = merge(item[metaProp], relaxedStructure, overlayItem[metaProp]);
        }
    }
    ;
    function comment(description, meta) {
        if (!meta)
            return description;
        const metaWithMarker = metaMarker + '(' + stringify(meta) + ')';
        if (!description)
            return metaWithMarker;
        description = description.split(metaMarker)[0];
        if (description.length == 0)
            return metaWithMarker;
        return description + separator + metaWithMarker;
    }
    let schema = JSON.parse(fs.readFileSync(schemaInPath).toString());
    if (!schema.data)
        schema = { "data": schema };
    const overlayIn = overlayInPath && JSON.parse(fs.readFileSync(overlayInPath).toString());
    schema.data.__schema.types
        .filter((ft) => isEntity(ft))
        .forEach((t) => {
        if (!allowExisting && t.hasOwnProperty(metaProp))
            throw new Error(`The schema already contains metadata (for table ${t.name})`);
        mergeMeta(t, overlayIn);
        t.fields
            .forEach((f) => {
            if (!allowExisting && f.hasOwnProperty(metaProp))
                throw new Error(`The schema already contains metadata (for field ${f.name})`);
            mergeMeta(f, overlayIn && overlayIn.find((oi) => oi.name == t.name).fields, t);
        });
    });
    if (schemaOutPath)
        fs.writeFileSync(schemaOutPath, JSON.stringify(schema, null, 2));
    const overlayOut = schema.data.__schema.types
        .filter((ft) => ft.hasOwnProperty(metaProp))
        .map((m) => {
        return { name: m.name, description: m.description, fields: m.fields
                .filter((ff) => ff.hasOwnProperty(metaProp))
                .map((fm) => { return { name: fm.name, description: fm.description, meta: fm[metaProp] }; }), meta: m[metaProp] };
    });
    if (overlayOutPath)
        fs.writeFileSync(overlayOutPath, JSON.stringify(overlayOut, null, 2));
    if (commentsOutPath)
        fs.writeFileSync(commentsOutPath, overlayOut.map((t) => `COMMENT ON TABLE ${t.name.toLowerCase()} IS '${comment(t.description, t[metaProp])}';
` + t.fields.map((f) => `COMMENT ON COLUMN ${t.name.toLowerCase()}.${f.name} IS '${comment(f.description, f[metaProp])}';
`).join("")).join("\n"));
    return schema;
}
exports.metaMerge = metaMerge;
function generate(templateDir, targetDir, schemaInPath, overlayInPath, defaultMeta = "./package.json", defaultMetaKey = "config.defaultMeta", evalExcludeFiles = /package.*\.json/) {
    function plural(word) { return pluralize_1.plural(word); }
    function singular(word) { return pluralize_1.singular(word); }
    const schema = metaMerge(schemaInPath, overlayInPath, defaultMeta, defaultMetaKey);
    const entities = schema.data.__schema.types.filter((f) => isEntity(f));
    function genCore(templateDir, targetDir) {
        fs.readdirSync(templateDir).forEach((targetName) => {
            if (fs.statSync(templateDir + "/" + targetName).isDirectory()) {
                try {
                    fs.mkdirSync(targetDir + "/" + targetName);
                }
                catch (err) {
                    if (err.code !== 'EEXIST')
                        throw err;
                }
                genCore(templateDir + "/" + targetName, targetDir + "/" + targetName);
            }
            else {
                const templateContent = "`" + fs.readFileSync(templateDir + "/" + targetName) + "`";
                if (targetName.includes(entityFilename)) {
                    entities.map((entity) => {
                        fs.writeFileSync(targetDir + "/" + targetName.replace(entityFilename, entity.name).toLowerCase(), eval(templateContent));
                    });
                }
                else
                    fs.writeFileSync(targetDir + "/" + targetName, evalExcludeFiles.test(targetName) ? templateContent : eval(templateContent));
            }
        });
    }
    genCore(templateDir, targetDir);
}
exports.generate = generate;
