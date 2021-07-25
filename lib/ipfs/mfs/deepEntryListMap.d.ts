/// <reference types="lodash" />
import Bluebird from 'bluebird';
import CID from 'cids';
import { StatResult } from 'ipfs-core-types/src/files';
export declare const deepEntryListMap: Map<string, string>;
export declare function appendDeepEntryListMapByStatResult(path: string, entry: StatResult): boolean;
export declare function appendDeepEntryListMap(path: string, cid: string | CID, isDirectory?: boolean): boolean;
export declare function loadDeepEntryListMapFromFile(): Bluebird<Map<string, string>>;
export declare function _saveDeepEntryListMapToFile(): Promise<any>;
export declare const saveDeepEntryListMapToFile: import("lodash").DebouncedFunc<typeof _saveDeepEntryListMapToFile>;
