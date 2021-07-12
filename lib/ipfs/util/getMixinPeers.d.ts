import Bluebird from 'bluebird';
import { ITSResolvable } from 'ts-type';
import { IUseIPFSApi } from '../../types';
export declare function getMixinPeers(ipfs?: ITSResolvable<IUseIPFSApi>): Bluebird<string[]>;
