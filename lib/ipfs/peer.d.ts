import { IUseIPFSApi } from '../types';
import { IDResult } from 'ipfs-core-types/src/root';
import Bluebird from 'bluebird';
import { Multiaddr } from 'multiaddr';
import AbortControllerTimer from 'abort-controller-timer';
import { ITSResolvable } from 'ts-type';
export declare const peerAbortController: AbortControllerTimer;
export declare function getPeerCacheKey(peerID: string): {
    peer_id: string;
    _not_multiaddr: boolean;
    peer_addr: Multiaddr;
};
export declare function connectPeers(ipfs: IUseIPFSApi, peerID: string, me?: IDResult, timeout?: number, extra?: {
    hidden?: boolean;
}): Promise<void>;
export declare function _connectPeers(ipfs: IUseIPFSApi, peerID: string, me?: ITSResolvable<IDResult>, timeout?: number, extra?: {
    hidden?: boolean;
}): Promise<void>;
export declare function connectPeersAll(ipfs: IUseIPFSApi, peers: ITSResolvable<string[]>, extra?: {
    hidden?: boolean;
    timeout?: number;
}): Bluebird<void[]>;
