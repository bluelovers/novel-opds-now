import { CpOptions } from 'ipfs-core-types/src/files';
import { IPFS } from 'ipfs-core-types';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';
export declare function _ipfsFilesCopyCID(ipfs: IPFS, file_cid: ICIDValue, file_path: string, options?: CpOptions): Promise<void>;
