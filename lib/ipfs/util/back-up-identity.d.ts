import { IIPFSControllerDaemon } from '../types';
declare const FILE_IDENTITY: string;
export { FILE_IDENTITY };
export declare function backupIdentity(ipfsd: IIPFSControllerDaemon): Promise<void>;
export declare function restoreIdentity(ipfsd: IIPFSControllerDaemon): void;
