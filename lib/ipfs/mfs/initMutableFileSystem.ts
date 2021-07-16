import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import { StatResult } from 'ipfs-core-types/src/files';

export function initMutableFileSystem(ipfs: ITSResolvable<IUseIPFSApi>)
{
	return Bluebird.resolve(ipfs)
		.then(async (ipfs )=> {

			let ret = await ipfs.add(`Hello from novel-opds-now Checker`, {
				pin: false,
				preload: true,
			});

			let file_cid = ret.cid;
			let file_path = `/novel-opds-now/Hello from novel-opds-now Checker.txt`;

			let file_stat: StatResult = await ipfs.files.stat(file_path, {
				hash: true,
			}).catch(e => null);

			if (file_stat.cid != file_cid)
			{
				await ipfs.files.rm(file_path).catch(e => null);
				await ipfs.files.cp(`/ipfs/${file_cid}`, file_path, {
					// @ts-ignore
					pin: false,
					parents: true,
				});
			}

			//console.debug(`[IPFS]`, `initMutableFileSystem`, ret)

		})
		.catch(e =>
		{
			console.warn(`[IPFS]`, `initMutableFileSystem`, e)
		})
	;
}
