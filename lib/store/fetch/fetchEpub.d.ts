/// <reference types="node" />
/// <reference types="bluebird" />
import { IFetchOptions } from 'fetch-ipfs/util';
import { RequestInit } from 'node-fetch';
export declare function fetchEpub(ipfs_href: string | URL, timeout: number, options?: {
    filter?(buf: Buffer): boolean;
    fetchOptions?: RequestInit;
} & IFetchOptions): import("bluebird")<Buffer>;
