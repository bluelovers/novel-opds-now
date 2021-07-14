import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
export declare function initHelloCheck(ipfs: ITSResolvable<IUseIPFSApi>): Bluebird<void>;
