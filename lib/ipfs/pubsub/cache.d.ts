import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
export declare const cachePubSubPeers: Set<string>;
export declare function updateCachePubSubPeers(ipfs?: ITSResolvable<IUseIPFSApi>, plusPeers?: ITSResolvable<string | string[]>): Bluebird<string[]>;
