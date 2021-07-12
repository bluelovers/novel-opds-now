import { IUseIPFSApi } from '../types';
import { IDResult } from 'ipfs-core-types/src/root';
import Bluebird from 'bluebird';
export declare function connectPeers(ipfs: IUseIPFSApi, peerID: string, me?: IDResult, timeout?: number, extra?: {
    hidden?: boolean;
}): Promise<void>;
export declare function connectPeersAll(ipfs: IUseIPFSApi): Bluebird<string[]>;
