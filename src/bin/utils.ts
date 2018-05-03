function deDupe(obj: object[]): object[] {
  // Insert array deduplication code (assuming name property must always be unique)
  return obj;
}

/**
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
*
* @param {...object} objects - Objects to merge
* @returns {object} New object with merged key/values
*/
function mergeDeep(...objects: object[]): object {
  const isObject = (obj: any) => obj && typeof obj === 'object';
  
  return objects.reduce((prev: any, obj: any) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];
      
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = deDupe(pVal.concat(...oVal));
      }
      else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      }
      else {
        prev[key] = oVal;
      }
    });
    
    return prev;
  }, {});
}
