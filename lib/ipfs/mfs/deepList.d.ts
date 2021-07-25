import { IUseIPFSApi } from '../../types';
export declare function deepList(ipfs: IUseIPFSApi, rootStart: string, options?: {
    debug?: boolean;
    glob?: string | string[];
    ignore?: string | string[];
}, isChild?: true): Promise<Map<string, string>>;
