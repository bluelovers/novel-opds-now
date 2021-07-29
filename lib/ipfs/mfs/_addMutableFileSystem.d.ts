import Bluebird from 'bluebird';
import { IUseIPFSApi } from '../../types';
import { ITSResolvable } from 'ts-type/lib/generic';
import CID from 'cids';
export declare const waitingCache: Set<string>;
export declare function _addMutableFileSystem(dir_path: string, data: {
    path: string;
    cid: string | CID;
}, options?: {
    ipfs?: ITSResolvable<IUseIPFSApi>;
    done?(file_path: string): ITSResolvable<any>;
}, ignoreWaitingCheck?: boolean): Bluebird<{
    dir_path: string;
    file_path: string;
    file_cid: import("@lazy-ipfs/to-cid").ICIDObject;
}>;
