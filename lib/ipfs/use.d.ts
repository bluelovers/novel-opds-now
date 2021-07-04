import { IIPFSAddresses } from 'ipfs-types';
import Bluebird from 'bluebird';
export declare function useIPFS(options?: {
    disposable?: boolean;
}): Bluebird<{
    ipfsd: {
        api: import("ipfs-core-types").IPFS & {
            getEndpointConfig(): import("ipfs-http-client/dist/src/types").EndpointConfig;
        };
        init(options?: any): Promise<any>;
        cleanup(): Promise<any>;
        start(): Promise<any>;
        stop(): Promise<any>;
        version(): Promise<string>;
        pid(): Promise<string>;
    };
    readonly ipfs: import("ipfs-core-types").IPFS & {
        getEndpointConfig(): import("ipfs-http-client/dist/src/types").EndpointConfig;
    };
    address(): Promise<IIPFSAddresses>;
    stop(): Promise<{
        api: import("ipfs-core-types").IPFS & {
            getEndpointConfig(): import("ipfs-http-client/dist/src/types").EndpointConfig;
        };
        init(options?: any): Promise<any>;
        cleanup(): Promise<any>;
        start(): Promise<any>;
        stop(): Promise<any>;
        version(): Promise<string>;
        pid(): Promise<string>;
    }>;
}>;
export declare function _info(data?: any): void;
