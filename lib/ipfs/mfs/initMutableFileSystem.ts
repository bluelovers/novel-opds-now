import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';

export function initMutableFileSystem(ipfs: ITSResolvable<IUseIPFSApi>)
{
	return Bluebird.resolve(ipfs)
		.then(async (ipfs )=> {

			let ret = await ipfs.add(`Hello from novel-opds-now Checker`, {
				pin: false,
				preload: true,
			});

			await ipfs.files.cp(`/ipfs/${ret.cid}`, `/novel-opds-now/Hello from novel-opds-now Checker.txt`, {
				// @ts-ignore
				pin: false,
				parents: true,
			}).catch(e => null);

			//console.debug(`[IPFS]`, `initMutableFileSystem`, ret)

		})
		.catch(e =>
		{
			console.warn(`[IPFS]`, `initMutableFileSystem`, e)
		})
	;
}
