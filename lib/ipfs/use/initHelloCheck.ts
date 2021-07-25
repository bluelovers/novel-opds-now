import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import { initMutableFileSystem } from '../mfs/initMutableFileSystem';
import Bluebird from 'bluebird';
import { readFile } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import { handleCachePeersFile } from '../../util/handleCachePeersFile';
import console from 'debug-color2/logger';
import { toCID } from '@lazy-ipfs/to-cid';
import CID from 'cids';
import itAll from 'it-all';
import { IIPFSControllerDaemon } from '../types';
import { loadDeepEntryListMapFromFile } from '../mfs/deepEntryListMap';

export function initHelloCheck(ipfs: ITSResolvable<IUseIPFSApi>, ipfsd: IIPFSControllerDaemon)
{
	return Bluebird.props({
			ipfs,
			ipfsd,
		})
		.then(async ({
			ipfs,
			ipfsd,
		}) =>
		{
			await loadDeepEntryListMapFromFile();

			let ls = await readFile(join(__root, 'lib/static/build-in-cids.txt'))
				.then(handleCachePeersFile);

			console.debug(`[IPFS]`, `initHelloCheck`, ls)

			await Bluebird.any(ls.map(async (cid: string | CID) =>
				{
					const timeout = 5000;

					cid = toCID(cid);

					await ipfs.pin.rm(cid, {
						timeout,
					}).catch(e => null);

					await itAll(ipfs.block.rm(cid as any, {
						force: true,
						quiet: true,
						timeout,
					})).catch(e => null);

					return itAll(ipfs.get(cid, {
						preload: true,
						timeout: 10 * 60 * 1000,
					}))
				}))
				.catch(e =>
				{
					console.warn(`[IPFS]`, `initHelloCheck`, e)
				})
			;

			await initMutableFileSystem(ipfs, ipfsd);
		})
}
