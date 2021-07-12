import { ITSResolvable } from 'ts-type';
import { IUseIPFSApi } from '../../types';
import { CpOptions, MkdirOptions, StatResult } from 'ipfs-core-types/src/files';
import CID from 'cids';
import Bluebird from 'bluebird';
export declare function ensureDir(ipfs: ITSResolvable<IUseIPFSApi>, dir_path: string, options?: CpOptions & MkdirOptions & {
    fromCID?: string | CID;
    overwriteTarget?: boolean;
}): Bluebird<StatResult>;
