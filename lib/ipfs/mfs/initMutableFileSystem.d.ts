import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import { IIPFSControllerDaemon } from '../types';
export declare function _checkIPFSWithMutableFileSystem(ipfs: ITSResolvable<IUseIPFSApi>): Bluebird<boolean>;
export declare function initMutableFileSystem(ipfs: ITSResolvable<IUseIPFSApi>, ipfsd: IIPFSControllerDaemon): Bluebird<any>;
