import { CpOptions, StatResult } from 'ipfs-core-types/src/files';
import CID from 'cids';
import { ipfsFilesCopy } from '@lazy-ipfs/compatible-files';
import { isSameCID } from '@lazy-ipfs/is-same-cid';
import { IPFS } from 'ipfs-core-types';
import { toPath, pathToCid } from 'to-ipfs-url';
import { toCID } from '@lazy-ipfs/to-cid';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';

export function _ipfsFilesCopyCID(ipfs: IPFS, file_cid: ICIDValue, file_path: string, options?: CpOptions)
{
	return ipfsFilesCopy(ipfs, toPath(file_cid), file_path, {
		parents: true,
		...options,
	})
		.catch(async (e) => {
			let file_stat: StatResult = await ipfs.files.stat(file_path, {
				hash: true,
			}).catch(e => null);

			if (!file_stat || !isSameCID(file_stat.cid, pathToCid(file_cid)))
			{
				return Promise.reject(e)
			}
		})
}
