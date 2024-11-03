import Bluebird from 'bluebird';
import { StatResult } from 'ipfs-core-types/src/files';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';
export declare const deepEntryListMap: Map<string, string>;
export declare const newEntryListMap: Map<string, string>;
export declare function pathDeepEntryListMapJson(): "/.cache/novel-opds-now.cids.json";
export declare function appendDeepEntryListMapByStatResult(path: string, entry: StatResult): boolean;
export declare function _handlePath(path: string, isDirectory?: boolean): string;
export declare function appendDeepEntryListMap(path: string, cid: ICIDValue | StatResult["cid"], isDirectory?: boolean, forceAdd?: boolean): boolean;
export declare function _setDeepEntryListMapBoth(path: string, cid: ICIDValue | StatResult["cid"], isDirectory?: boolean): void;
export declare function _getDeepEntryListMapBoth(path: string, isDirectory?: boolean): string;
export declare function loadDeepEntryListMapFromFile(): Bluebird<Map<string, string>>;
export declare function loadDeepEntryListMapFromServer(): Bluebird<Map<string, string>>;
export declare function loadDeepEntryListMapFromMixin(): Bluebird<Map<string, string>>;
export declare function _saveDeepEntryListMapToServer(): Bluebird<Map<string, string>>;
export declare function enableForceSave(): void;
export declare function enableOverwriteServer(): void;
export declare function _writeDeepEntryListMapToMfs(content: string | [string, string][] | Map<string, string>): Bluebird<void>;
export declare function _backupDeepEntryListMap(cid: ICIDValue, peerID?: string): Promise<void>;
export declare function _pokeDeepEntryListMap(cid?: ICIDValue, peerID?: string): Bluebird<void | import("ts-type").ITSPromiseSettledResult<import("ts-type").ITSPromiseSettledResult<ITSUnpackedPromiseLike<Promise<(Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "error"> & {
    error: Error;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: string;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: false;
})>>>[]>[]>;
export declare const pokeDeepEntryListMap: import("lodash").DebouncedFunc<typeof _pokeDeepEntryListMap>;
export declare function stringifyDeepEntryListMap(deepEntryListMap: Map<string, string> | [string, string][]): string;
export declare function _saveDeepEntryListMapToFile(): Bluebird<Map<string, string>>;
export declare const saveDeepEntryListMapToFile: import("lodash").DebouncedFunc<typeof _saveDeepEntryListMapToFile>;
export declare const saveDeepEntryListMapToServer: import("lodash").DebouncedFunc<typeof _saveDeepEntryListMapToServer>;
export declare function saveDeepEntryListMapToMixin(): Bluebird<Map<string, string>>;
export declare function mergeDeepEntryListMap(input: Map<string, string> | [string, string][], target: Map<string, string>, keepExists?: boolean): Map<string, string>;
export declare function fixDeepEntryListMap(deepEntryListMap: Map<string, string>): Map<string, string>;
export declare function _publishDeepEntryListMapToIPFS(ipfs: any, deepEntryListMap: Map<string, string>): Promise<{
    cid: string;
    content: string;
}>;
export declare function _putDeepEntryListMapToServer(ipfs: any, cid: ICIDValue): Bluebird<import("@demonovel/db-api").IFileRecordRow<{
    timestamp: number;
    exists: true;
    filename: "novel-opds-now.cids.json";
    href: string;
}>>;
