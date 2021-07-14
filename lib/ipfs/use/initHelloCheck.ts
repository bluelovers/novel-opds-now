import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import { initMutableFileSystem } from '../mfs/initMutableFileSystem';
import Bluebird from 'bluebird';
import { readFile } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import { handleCachePeersFile } from '../../util/handleCachePeersFile';
import console from 'debug-color2/logger';

export function initHelloCheck(ipfs: ITSResolvable<IUseIPFSApi>)
{
	return Bluebird.resolve(ipfs)
		.then(async (ipfs) => {

			let ls = await readFile(join(__root, 'lib/static/build-in-cids.txt'))
				.then(handleCachePeersFile);

			console.debug(`[IPFS]`, `initHelloCheck`, ls)

			await Bluebird.any(ls.map(cid => ipfs.get(cid, {
					preload: true,
				})))
				.catch(e =>
				{
					console.warn(`[IPFS]`, `initHelloCheck`, e)
				})
			;

			await initMutableFileSystem(ipfs);
		})
}
