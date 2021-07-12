import { IUseIPFSApi } from '../types';
import { IDResult } from 'ipfs-core-types/src/root';
import Bluebird from 'bluebird';
import AbortControllerTimer from 'abort-controller-timer';
export declare const peerAbortController: AbortControllerTimer;
export declare function connectPeers(ipfs: IUseIPFSApi, peerID: string, me?: IDResult, timeout?: number, extra?: {
    hidden?: boolean;
}): Promise<void>;
export declare function connectPeersAll(ipfs: IUseIPFSApi): Bluebird<string[]>;
