/// <reference types="node" />
import { IPFS } from 'ipfs-core-types';
import { IFetchOptions } from 'fetch-ipfs/util';
import { ITSResolvable } from 'ts-type/lib/generic';
import Bluebird from 'bluebird';
export declare function raceFetchServerList(ipfs: IPFS, ipfs_href: string, timeout?: number, options?: {
    filter?(buf: Buffer): boolean;
} & IFetchOptions): Promise<string[]>;
export declare function raceFetchAll(list: ITSResolvable<string[]>, timeout?: number, options?: {
    filter?(buf: Buffer): boolean;
} & IFetchOptions): Bluebird<Bluebird<Buffer>>;
