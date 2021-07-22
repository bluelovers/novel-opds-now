import { CpOptions } from 'ipfs-core-types/src/files';
import CID from 'cids';
import { IPFS } from 'ipfs-core-types';
export declare function _ipfsFilesCopyCID(ipfs: IPFS, file_cid: CID | string, file_path: string, options?: CpOptions): Promise<void>;
