import { IPubSubEpub } from '../types';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import { ITSPromiseSettledResult } from 'ts-type';
export declare function pokeMutableFileSystem(options: IPubSubEpub, title: string): Bluebird<ITSPromiseSettledResult<{
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: string;
} | {
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    headers?: Headers;
    statusText?: string;
    error: Error;
}, any>[][][]>;
export declare function pokeMutableFileSystemCore(title: string, paths: string[]): Bluebird<ITSPromiseSettledResult<{
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: string;
} | {
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    headers?: Headers;
    statusText?: string;
    error: Error;
}, any>[][][]>;
export declare function _pokeMutableFileSystem(ipfs: IUseIPFSApi, path: string, title?: string): Bluebird<ITSPromiseSettledResult<{
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: string;
} | {
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    headers?: Headers;
    statusText?: string;
    error: Error;
}, any>[][]>;
