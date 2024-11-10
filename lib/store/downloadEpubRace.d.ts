import { ITSValueOrArray } from 'ts-type';
import { IUseIPFSApi } from '../types';
import { IFetchOptions } from 'fetch-ipfs/util';
import Bluebird from 'bluebird';
import { RequestInit } from 'node-fetch';
export declare function fetchEpubAll(ipfs_href: string, timeout: number, options?: {
    filter?(buf: Buffer): boolean;
    fetchOptions?: RequestInit;
} & IFetchOptions): Bluebird<Buffer<ArrayBufferLike>>;
export declare function downloadEpubRace(ipfs_href: string, useIPFS?: ITSValueOrArray<string | IUseIPFSApi>, timeout?: number, options?: {
    filter?(buf: Buffer): boolean;
    fetchOptions?: RequestInit;
} & IFetchOptions): Bluebird<Buffer<ArrayBufferLike>>;
export declare function _abortController(controller: any, signal: any): void;
