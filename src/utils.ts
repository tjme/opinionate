/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge an object with others.
 * @param target a base object
 * @param relaxed boolean flag indicating whether properties not already present in the target should be added
 * @param ...sources additional object(s) to be merged in
 * @returns {object} the merger of all input objects
 */
export function merge(target: any, relaxed = false, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (relaxed && !target.hasOwnPropert(key)) Object.assign(target, { [key]: {} });
        merge(target[key], relaxed, source[key]);
      } else {
        if (relaxed || (isObject(target) && target.hasOwnProperty(key))) Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, relaxed, ...sources);
}

/**
 * Similar to JSON.stringify, but without the quotes around object properties insisted on by strict JSON conformity
 * @param ob object to stringify
 * @returns {string} a "relaxed" string representation of an object
 */
export function stringify(ob: any): string {
  if(typeof ob !== "object" || Array.isArray(ob)){ return JSON.stringify(ob); }
  let props = Object
    .keys(ob)
    .map(key => `${key}:${stringify(ob[key])}`);
  return `${props}`; };

/**
 * Convert/clean relaxed object representations (including GraphQL) to strict JSON, allowing further processing, e.g. with JSON.parse
 * @param ob the object to convert to strict JSON
 * @returns {string}
 */
export function convert(ob: string): string {
  return "{"+ob
  .replace(/^\((.*)\)$/g,'$1').replace(/^\"(.*)\"$/g,'$1').replace(/^\{(.*)\}$/g,'$1') // Remove any outer brackets and/or double quotes and/or curly brackets
	.replace(/:\s*"([^"]*)"/g, function(match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
	.replace(/:\s*'([^']*)'/g, function(match, p1) { return ': "' + p1.replace(/:/g, '@colon@') + '"'; })
	.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
	.replace(/@colon@/g, ':')+"}"
}

/**
 * 
 * @param txt the string to convert to Proper case (initial capital, followed by all lower case)
 */
export function toProperCase(txt: string): string { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); };
