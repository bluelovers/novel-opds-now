/// <reference types="lodash" />
import { ICacheMapRow } from '../types';
import Bluebird from 'bluebird';
export declare const __epubProcessCacheFile: string;
export declare const epubProcessCache: Map<`${string}##${string}`, ICacheMapRow>;
export declare function epubProcessCacheKey(IDKEY: string, novel_id: string): `${string}##${string}`;
export declare function epubProcessCacheKey(data: ICacheMapRow): `${string}##${string}`;
export declare function getEpubProcessCacheRow(IDKEY: string, novel_id: string): ICacheMapRow;
export declare function getEpubProcessCacheRow(data: ICacheMapRow): ICacheMapRow;
export declare function removeEpubProcessCacheRow(IDKEY: string, novel_id: string): boolean;
export declare function removeEpubProcessCacheRow(data: ICacheMapRow): boolean;
export declare function replaceEpubProcessCacheRow(IDKEY: string, novel_id: string, data: Partial<ICacheMapRow>): boolean;
export declare function _merge(IDKEY: string, novel_id: string, data: Partial<ICacheMapRow>): ICacheMapRow;
export declare const appendEpubProcessCache: (arg1: string, arg2: string, arg3: Partial<ICacheMapRow>) => Bluebird<void>;
export declare function _saveEpubProcessCache(): Bluebird<unknown>;
export declare const saveEpubProcessCache: import("lodash").DebouncedFunc<typeof _saveEpubProcessCache>;
export declare function readEpubProcessCache(): Bluebird<Map<`${string}##${string}`, ICacheMapRow>>;
