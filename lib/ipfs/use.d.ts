import '../util/processHandle';
import { IIPFSAddresses } from 'ipfs-types';
import Bluebird from 'bluebird';
import { IUseIPFSApi } from '../types';
export declare function useIPFS(options?: {
    disposable?: boolean;
}): Bluebird<{
    ipfsd: import("./types").IIPFSControllerDaemon;
    path: string;
    readonly ipfs: IUseIPFSApi;
    address(): Promise<IIPFSAddresses>;
    stop: (done?: any) => void;
    stopAsync(): Bluebird<void>;
}>;
export declare function searchIpfs(): Bluebird<{
    ipfsd: null;
    ipfs: IUseIPFSApi;
    stop(...argv: any[]): Promise<void>;
}>;
export declare function _useIPFS(options?: {
    disposable?: boolean;
}): Bluebird<{
    ipfsd: import("./types").IIPFSControllerDaemon;
    path: string;
    readonly ipfs: IUseIPFSApi;
    address(): Promise<IIPFSAddresses>;
    stop: (done?: any) => void;
    stopAsync(): Bluebird<void>;
}>;
export declare function _info(data?: any): void;
export declare function getIPFS(): Bluebird<IUseIPFSApi>;
export declare function useIPFSFromCache(): Bluebird<{
    ipfsd: import("./types").IIPFSControllerDaemon;
    path: string;
    readonly ipfs: IUseIPFSApi;
    address(): Promise<IIPFSAddresses>;
    stop: (done?: any) => void;
    stopAsync(): Bluebird<void>;
}>;
export declare function getIPFSFromCache(): Bluebird<IUseIPFSApi>;
export declare function setIPFSToCache(ipfs: IUseIPFSApi): void;
