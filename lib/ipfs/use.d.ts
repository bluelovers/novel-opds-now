import { IIPFSAddresses } from 'ipfs-types';
import Bluebird from 'bluebird';
import { IUseIPFSApi } from '../types';
export declare function useIPFS(options?: {
    disposable?: boolean;
}): Bluebird<{
    ipfsd: {
        api: IUseIPFSApi;
        init(options?: any): Promise<any>;
        cleanup(): Promise<any>;
        start(): Promise<any>;
        stop(): Promise<any>;
        version(): Promise<string>;
        pid(): Promise<string>;
    };
    readonly ipfs: IUseIPFSApi;
    address(): Promise<IIPFSAddresses>;
    stop(): Promise<{
        api: IUseIPFSApi;
        init(options?: any): Promise<any>;
        cleanup(): Promise<any>;
        start(): Promise<any>;
        stop(): Promise<any>;
        version(): Promise<string>;
        pid(): Promise<string>;
    }>;
}>;
export declare function _info(data?: any): void;
