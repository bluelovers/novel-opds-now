/// <reference types="node" />
import { ITSValueOrArray } from 'ts-type';
import { IUseIPFSApi } from '../types';
import { IFetchOptions } from 'fetch-ipfs/util';
import Bluebird from 'bluebird';
export declare function fetchEpub(ipfs_href: string, timeout: number, options?: {
    filter?(buf: Buffer): boolean;
} & IFetchOptions): Bluebird<Buffer>;
export declare function fetchEpubAll(ipfs_href: string, timeout: number, options?: {
    filter?(buf: Buffer): boolean;
} & IFetchOptions): Promise<Buffer>;
export declare function downloadEpubRace(ipfs_href: string, useIPFS?: ITSValueOrArray<string | IUseIPFSApi>, timeout?: number, options?: {
    filter?(buf: Buffer): boolean;
} & IFetchOptions): Bluebird<Buffer>;
export declare function assertEpubByMime(buffer: Buffer): Promise<never>;
