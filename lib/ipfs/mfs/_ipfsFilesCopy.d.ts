import { StatResult } from 'ipfs-core-types/src/files';
import { IFilesCpOptionsExtra } from '@lazy-ipfs/compatible-files/lib/cp';
import { IPFS } from 'ipfs-core-types';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';
export declare function _ipfsFilesCopyCID(ipfs: IPFS, file_cid: ICIDValue, file_path: string, options?: IFilesCpOptionsExtra): Promise<StatResult>;
