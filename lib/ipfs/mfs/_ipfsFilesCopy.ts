import { CpOptions, StatResult } from 'ipfs-core-types/src/files';
import CID from 'cids';
import { ipfsFilesCopy, IFilesCpOptionsExtra } from '@lazy-ipfs/compatible-files/lib/cp';
import { isSameCID } from '@lazy-ipfs/is-same-cid';
import { IPFS } from 'ipfs-core-types';
import { toPath, pathToCid, pathToCidSource } from 'to-ipfs-url';
import { toCID } from '@lazy-ipfs/to-cid';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';

export function _ipfsFilesCopyCID(ipfs: IPFS, file_cid: ICIDValue, file_path: string, options?:  IFilesCpOptionsExtra)
{
	options = {
		parents: true,
		...options,
		extraOptions: {
			validCheck: true,
			...options.extraOptions,
		}
	}

	return ipfsFilesCopy(ipfs, toPath(file_cid), file_path, options)
}
