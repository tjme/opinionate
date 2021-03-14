export declare function isObject(item: any): boolean;
export declare function get(obj: any, key: string): any;
export declare function merge(target: any, relaxed?: boolean, ...sources: any[]): any;
export declare function stringify(ob: any): string;
export declare function convert(ob: string): string;
export declare function toProperCase(txt: string): string;
export declare function isEntity(entity: any): boolean;
export declare function isField(field: any): boolean;
export declare function getType(field: any): string;
export declare function isType(field: any, type: string): boolean;
export declare function pluralize(word: string): string;
export declare function metaMerge(schemaInPath: string, overlayInPath?: string, defaultMeta?: string, schemaOutPath?: string, overlayOutPath?: string, commentsOutPath?: string, allowExisting?: boolean, cleanDescriptions?: boolean, ignoreComments?: boolean, relaxedStructure?: boolean, returnOverlay?: boolean): any;
export declare function generate(templateDir: string, targetDir: string, schemaInPath: string, overlayInPath?: string, defaultMeta?: string): void;
