import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
export declare function deepList(ipfs: IUseIPFSApi, rootStart: string, options?: {
    debug?: boolean;
    glob?: string | string[];
    ignore?: string | string[];
}, isChild?: true): Bluebird<Map<string, string>>;
