import Bluebird from 'bluebird';
import { getIPFS } from '../use';
import { toCID } from '@lazy-ipfs/to-cid';
import { StatResult } from 'ipfs-core-types/src/files';
import { isSameCID } from '@lazy-ipfs/is-same-cid';
import { IUseIPFSApi } from '../../types';
import { ITSResolvable } from 'ts-type/lib/generic';
import CID from 'cids';
import { ipfsFilesCopy } from '@lazy-ipfs/compatible-files';
import { _ipfsFilesCopyCID } from './_ipfsFilesCopy';

export const waitingCache = new Set<string>()

export function _addMutableFileSystem(dir_path: string, data: {
	path: string,
	cid: string | CID,
}, options?: {
	ipfs?: ITSResolvable<IUseIPFSApi>,
	done?(file_path: string): ITSResolvable<any>,
}, ignoreWaitingCheck?: boolean)
{
	return Bluebird.resolve()
		.then(() =>
		{

			const file_path = `${dir_path}/${data.path}`;

			if (!ignoreWaitingCheck && waitingCache.has(file_path))
			{
				return;
			}

			return Bluebird.resolve(options?.ipfs ?? getIPFS()).then(async (ipfs) =>
				{
					let file_cid = toCID(data.cid);

					let file_stat: StatResult = await ipfs.files.stat(file_path, {
						hash: true,
					}).catch(e => null);

					if (!file_stat || !isSameCID(file_stat.cid, file_cid))
					{
						await ipfs.files.rm(file_path).catch(e => null);

						await _ipfsFilesCopyCID(ipfs, file_cid, file_path, {
							parents: true,
						})
					}

					return {
						dir_path,
						file_path,
						file_cid,
					}
				})
				.finally(() =>
				{
					return options?.done?.(file_path);
				})
		})

}
