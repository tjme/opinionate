"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
exports.isObject = isObject;
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
function toProperCase(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }
exports.toProperCase = toProperCase;
;
