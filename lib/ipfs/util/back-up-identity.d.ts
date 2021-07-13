import Bluebird from 'bluebird';
import { IIPFSControllerDaemon } from '../types';
export declare function backupIdentity(ipfsd: IIPFSControllerDaemon): Promise<void>;
export declare function restoreIdentity(ipfsd: IIPFSControllerDaemon): Bluebird<void>;
