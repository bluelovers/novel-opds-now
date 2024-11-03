import { IFetchOptions } from 'fetch-ipfs/util';
import { RequestInit } from 'node-fetch';
import Bluebird from 'bluebird';
export declare function fetchEpub(ipfs_href: string | URL, timeout: number, options?: {
    filter?(buf: Buffer): boolean;
    fetchOptions?: RequestInit;
} & IFetchOptions): Bluebird<Buffer>;
