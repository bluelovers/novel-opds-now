import Bluebird from 'bluebird';
import { IUseIPFSApi } from '../../types';
import { ITSResolvable } from 'ts-type/lib/generic';
export declare function getBuildInPeers(): Bluebird<string[]>;
export declare function getCachePeers(force?: boolean): Bluebird<string[]>;
export declare function _connectPeers(ipfs: ITSResolvable<IUseIPFSApi>, ls: ITSResolvable<string[]>, extra?: {
    hidden?: boolean;
}): Bluebird<void[]>;
export declare function connectCachePeers(ipfs: ITSResolvable<IUseIPFSApi>): Bluebird<void[]>;
export declare function connectBuildInPeers(ipfs: ITSResolvable<IUseIPFSApi>): Bluebird<void[]>;
