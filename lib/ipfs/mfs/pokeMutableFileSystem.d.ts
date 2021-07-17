import { IPubSubEpub } from '../types';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import { ITSPromiseSettledResult } from 'ts-type';
export declare function pokeMutableFileSystem(options: IPubSubEpub, title: string): Bluebird<ITSPromiseSettledResult<{
    href: string;
    error?: Error;
    status?: number;
    statusText?: string;
    headers?: Headers;
    value: string;
} | {
    href: string;
    error?: Error;
    status?: number;
    statusText?: string;
    headers?: Headers;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    statusText?: string;
    headers?: Headers;
    error: Error;
}, any>[][][]>;
export declare function pokeMutableFileSystemCore(title: string, paths: string[]): Bluebird<ITSPromiseSettledResult<{
    href: string;
    error?: Error;
    status?: number;
    statusText?: string;
    headers?: Headers;
    value: string;
} | {
    href: string;
    error?: Error;
    status?: number;
    statusText?: string;
    headers?: Headers;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    statusText?: string;
    headers?: Headers;
    error: Error;
}, any>[][][]>;
export declare function _pokeMutableFileSystem(ipfs: IUseIPFSApi, path: string, title?: string): Bluebird<ITSPromiseSettledResult<{
    href: string;
    error?: Error;
    status?: number;
    statusText?: string;
    headers?: Headers;
    value: string;
} | {
    href: string;
    error?: Error;
    status?: number;
    statusText?: string;
    headers?: Headers;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    statusText?: string;
    headers?: Headers;
    error: Error;
}, any>[][]>;
