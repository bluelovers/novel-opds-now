import { ITSResolvable } from 'ts-type';
import { IUseIPFSApi } from '../../types';
import { CpOptions, MkdirOptions, StatResult } from 'ipfs-core-types/src/files';
import Bluebird from 'bluebird';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';
export declare function ensureDir(ipfs: ITSResolvable<IUseIPFSApi>, dir_path: string, options?: CpOptions & MkdirOptions & {
    fromCID?: ICIDValue;
    overwriteTarget?: boolean;
}): Bluebird<StatResult>;
