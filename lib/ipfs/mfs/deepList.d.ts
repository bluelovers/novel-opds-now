import { IUseIPFSApi } from '../../types';
export declare function deepList(ipfs: IUseIPFSApi, rootStart: string, options?: {
    debug?: boolean;
}, isChild?: true): Promise<Record<string, string>>;
