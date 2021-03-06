"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.metaMerge = exports.pluralize = exports.isType = exports.getType = exports.isField = exports.isEntity = exports.toProperCase = exports.convert = exports.stringify = exports.merge = exports.get = exports.isObject = void 0;
const fs = require("fs");
const _pluralize = require("pluralize");
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
exports.isObject = isObject;
function get(obj, key) {
    return key.split(".").reduce(function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
}
exports.get = get;
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
exports.merge = merge;
function stringify(ob) {
    if (typeof ob !== "object" || Array.isArray(ob)) {
        return JSON.stringify(ob);
    }
    let props = Object
        .keys(ob)
        .map(key => `${key}:${stringify(ob[key])}`);
    return `${props}`;
}
exports.stringify = stringify;
;
function convert(ob) {
    return "{" + ob
        .replace(/^\((.*)\)$/g, '$1').replace(/^\"(.*)\"$/g, '$1').replace(/^\{(.*)\}$/g, '$1')
        .replace(/:\s*"([^"]*)"/g, function (match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
        .replace(/:\s*'([^']*)'/g, function (match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
        .replace(/@colon@/g, ':') + "}";
}
exports.convert = convert;
function toProperCase(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
}
exports.toProperCase = toProperCase;
function isEntity(entity) {
    return entity.kind == "OBJECT" && entity.name !== "Query" && entity.interfaces.length > 0 && entity.interfaces[0].name == "Node";
}
exports.isEntity = isEntity;
function isField(field) {
    return field.name !== "nodeId" && field.type && (field.type.kind == "SCALAR" || (field.type["ofType"] && field.type.ofType["kind"] == "SCALAR"));
}
exports.isField = isField;
function getType(field) {
    return isField(field) && (field.type.name || (field.type.ofType && field.type.ofType.name));
}
exports.getType = getType;
function isType(field, type) { return (getType(field) === type); }
exports.isType = isType;
;
function pluralize(word) {
    return _pluralize.plural(word);
}
exports.pluralize = pluralize;
;
const metaProp = "meta", metaMarker = "@meta", separator = "\n";
function metaMerge(schemaInPath, overlayInPath, defaultMeta, schemaOutPath, overlayOutPath, commentsOutPath, allowExisting = false, cleanDescriptions = false, ignoreComments = false, relaxedStructure = false, returnOverlay = false) {
    function mergeMeta(item, overlay) {
        const es6Meta = "`" + ((defaultMeta && fs.readFileSync(defaultMeta).toString()) ||
            `
        label: "${toProperCase(item.name)}",
        format: "${['money', 'money!'].includes(getType(item)) ? 'currency' : ['Boolean', 'Boolean!'].includes(getType(item)) ? 'boolean' : ['Datetime', 'Datetime!'].includes(getType(item)) ? 'date' : ['Int', 'Int!', 'BigInt', 'BigInt!', 'Float', 'Float!', 'BigFloat', 'BigFloat!'].includes(getType(item)) ? 'number' : 'string'}",
        required: ${getType(item) && '!' == getType(item).slice(-1) ? true : false},
        validation: null,
        align: "${['money', 'money!', 'Datetime', 'Datetime!', 'Int', 'Int!', 'BigInt', 'BigInt!', 'Float', 'FLoat!', 'BigFloat', 'BigFLoat!'].includes(getType(item)) ? 'right' : 'left'}",
        attributes: null,
        readonly: false,
        templates: ["switchboard","list", "crud"]
      `) + "`";
        item[metaProp] = JSON.parse(convert(eval(es6Meta)));
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
            .filter((f) => isField(f))
            .forEach((f) => {
            if (!allowExisting && f.hasOwnProperty(metaProp))
                throw new Error(`The schema already contains metadata (for field ${f.name})`);
            mergeMeta(f, overlayIn && overlayIn.find((oi) => oi.name == t.name).fields);
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
function generate(templateDir, targetDir, schemaInPath, overlayInPath, defaultMeta) {
    const schema = metaMerge(schemaInPath, overlayInPath, defaultMeta);
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
