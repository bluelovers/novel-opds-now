import Bluebird from 'bluebird';
import { IIPFSControllerDaemon } from '../use';
export declare function backupIdentity(ipfsd: IIPFSControllerDaemon): Promise<void>;
export declare function restoreIdentity(ipfsd: IIPFSControllerDaemon): Bluebird<void>;
