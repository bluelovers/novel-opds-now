import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import { IIPFSControllerDaemon } from '../types';
export declare function initHelloCheck(ipfs: ITSResolvable<IUseIPFSApi>, ipfsd: IIPFSControllerDaemon): Bluebird<void>;
