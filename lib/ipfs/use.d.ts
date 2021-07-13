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
export declare function searchIpfs(): Promise<{
    ipfsd: null;
    ipfs: IUseIPFSApi;
    stop(...argv: any[]): Promise<void>;
}>;
export declare function _info(data?: any): void;
export declare function getIPFS(): Bluebird<IUseIPFSApi>;
