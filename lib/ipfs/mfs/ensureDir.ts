import { ITSResolvable } from 'ts-type';
import { IUseIPFSApi } from '../../types';
import { CpOptions, MkdirOptions, StatResult } from 'ipfs-core-types/src/files';
import CID from 'cids';
import Bluebird from 'bluebird';
import { ipfsFilesCopy } from '@lazy-ipfs/compatible-files';
import { _ipfsFilesCopyCID } from './_ipfsFilesCopy';

export function ensureDir(ipfs: ITSResolvable<IUseIPFSApi>, dir_path: string, options?: CpOptions & MkdirOptions & {
	fromCID?: string | CID,
	overwriteTarget?: boolean,
})
{
	return Bluebird.resolve(ipfs)
		.then(async (ipfs) =>
		{
			let dir_stat: StatResult = await ipfs.files.stat(dir_path).catch(e => null);
			let {
				fromCID,
				overwriteTarget,
				...opts
			} = options ?? {} as null;

			opts.parents = true;

			let _do = true;

			if (dir_stat)
			{
				if (dir_stat.type !== 'directory')
				{
					throw new Error(`Target path not a directory: '${dir_path}'`)
				}

				if (options.fromCID && options.overwriteTarget)
				{
					await ipfs.files.rm(dir_path, {
						recursive: true,
					});
				}
				else
				{
					_do = false;
				}
			}
			else
			{
				if (!dir_path?.length || dir_path[dir_path.length - 1] !== '/')
				{
					throw new Error(`Invalid directory path: '${dir_path}'`)
				}
			}

			if (_do)
			{
				if (options.fromCID)
				{
					await _ipfsFilesCopyCID(ipfs, options.fromCID, dir_path, opts);
				}
				else
				{
					await ipfs.files.mkdir(dir_path, opts);
				}
			}

			return ipfs.files.stat(dir_path)
		})
}
