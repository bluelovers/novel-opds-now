/// <reference types="node" />
/// <reference types="bluebird" />
import { IFetchOptions } from 'fetch-ipfs/util';
export declare function fetchEpub(ipfs_href: string, timeout: number, options?: {
    filter?(buf: Buffer): boolean;
} & IFetchOptions): import("bluebird")<Buffer>;
