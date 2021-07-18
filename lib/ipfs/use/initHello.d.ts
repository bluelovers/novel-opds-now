import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
export declare function initHello(ipfs: ITSResolvable<IUseIPFSApi>): Bluebird<IUseIPFSApi>;
