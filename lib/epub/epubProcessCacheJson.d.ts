/// <reference types="lodash" />
import { ICacheMapRow } from '../types';
export declare const _doTask: import("lodash").DebouncedFunc<() => Promise<void>>;
export declare function deleteEpubProcessCacheJson(IDKEY: string, novel_id: string | string[], _data?: Partial<ICacheMapRow> & {
    expire?: number;
}): void;
export declare function getEpubProcessCacheJson(IDKEY: string, novel_id: string): Promise<ICacheMapRow | (Partial<ICacheMapRow> & {
    expire?: number;
})>;
