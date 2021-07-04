import { IIPFSAddresses } from 'ipfs-types';
import Bluebird from 'bluebird';
import { IUseIPFSApi } from '../types';
export declare function useIPFS(options?: {
    disposable?: boolean;
}): Bluebird<{
    ipfsd: any;
    readonly ipfs: IUseIPFSApi;
    address(): Promise<IIPFSAddresses>;
    stop(): Promise<void>;
}>;
export declare function searchIpfs(): Promise<{
    ipfs: IUseIPFSApi;
    stop: (options?: import("ipfs-core-types").AbortOptions) => Promise<void>;
}>;
export declare function _info(data?: any): void;
