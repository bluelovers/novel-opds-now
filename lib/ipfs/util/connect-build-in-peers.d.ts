import Bluebird from 'bluebird';
import { IUseIPFSApi } from '../../types';
import { ITSResolvable } from 'ts-type/lib/generic';
export declare function connectBuildInPeers(ipfs?: ITSResolvable<IUseIPFSApi>): Bluebird<void>;
