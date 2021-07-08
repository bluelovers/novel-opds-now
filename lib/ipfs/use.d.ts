import { IIPFSAddresses } from 'ipfs-types';
import Bluebird from 'bluebird';
import { IUseIPFSApi } from '../types';
declare module 'ipfs-env' {
    interface IIPFSEnv {
        IPFS_DISPOSABLE?: boolean;
    }
}
export declare function useIPFS(options?: {
    disposable?: boolean;
}): Bluebird<{
    ipfsd: IIPFSControllerDaemon;
    path: string;
    readonly ipfs: IUseIPFSApi;
    address(): Promise<IIPFSAddresses>;
    stop: (done: any) => void;
    stopAsync(): Bluebird<void>;
}>;
export declare function searchIpfs(): Promise<{
    ipfsd: null;
    ipfs: IUseIPFSApi;
    stop(...argv: any[]): Promise<void>;
}>;
export interface IIPFSControllerDaemon {
    started: boolean;
    path: string;
    api: IUseIPFSApi;
    opts: {
        disposable: boolean;
        ipfsOptions?: {
            init?: boolean;
        };
        ipfsBin?: string;
    };
    disposable: boolean;
    init(options?: any): Promise<IIPFSControllerDaemon>;
    cleanup(): Promise<IIPFSControllerDaemon>;
    start(): Promise<IIPFSControllerDaemon>;
    stop(): Promise<IIPFSControllerDaemon>;
    version(): Promise<string>;
    pid(): Promise<string>;
}
export declare function _info(data?: any): void;
export declare function getIPFS(): Bluebird<IUseIPFSApi>;
