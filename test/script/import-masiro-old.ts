/**
 * Created by user on 2021/8/16.
 */

import loadCache from '../../lib/site/masiro/load';
import { searchIpfs, setIPFSToCache } from '../../lib/ipfs/use';
import { getCalibrePaths } from '../../server/router/calibre/util';
import {
	_saveDeepEntryListMapToFile,
	_setDeepEntryListMapBoth,
	enableForceSave, enableOverwriteServer,
	loadDeepEntryListMapFromFile,
} from '../../lib/ipfs/mfs/deepEntryListMap';
import Bluebird from 'bluebird';
import { ipfsAddresses } from 'ipfs-util-lib';
import { LazyURL } from 'lazy-url';
import { multiaddrToURL } from 'multiaddr-to-url';
import fetch from '../../lib/fetch';
import { getFilePath } from 'calibre-db';
import { pathToCid } from 'to-ipfs-url';
import console from 'debug-color2/logger';
import { _saveMutableFileSystemRoots, saveMutableFileSystemRoots } from '../../lib/ipfs/mfs/saveMutableFileSystemRoots';

searchIpfs()
	.tap(async ({ ipfs, stop }) =>
	{
		setIPFSToCache(ipfs);

		await loadDeepEntryListMapFromFile();

		let baseURL = await ipfsAddresses(ipfs).then(info => new LazyURL(multiaddrToURL(info.API)));

		baseURL.port = 3000;
		baseURL.pathname = '';

		const list = await loadCache(false);
		const length = list.length;

		for (let index = 0; index < length; index++)
		{
			let novel = list[index];

			let label = `${(index + 1).toString().padStart(5, '0')}／${length.toString().padStart(5, '0')}`

			let cid: string;

			await fetch(new LazyURL(`/file/masiro/${novel.id}`, baseURL))
				.tap(res => {
					let x = res.headers.get('X-Ipfs-Path');

					if (x?.length)
					{
						cid = x;
					}

				})
				.tap(v => console.success(label, `done`, novel.id, novel.title, cid))
				.tapCatch(console.error)
			;

			if (index && (index % 3) === 0)
			{
				enableForceSave();
				enableOverwriteServer();

				await _saveDeepEntryListMapToFile();

				console.debug(`delay`, '30s');

				await ipfs.files.ls('/novel-opds-now/masiro', {
					timeout: 10 * 1000,
				});

				await Bluebird.delay(30 * 1000);
			}
		}

		enableForceSave();
		enableOverwriteServer();

		await _saveDeepEntryListMapToFile();

		await _saveMutableFileSystemRoots(ipfs)

		return stop();
	})
	.tapCatch(async (e) => {
		console.dir(e);

		enableForceSave();
		enableOverwriteServer();

		await _saveDeepEntryListMapToFile();

	})
	.finally(async () => {
		await Bluebird.delay(30 * 1000);

		process.exit();
	})
;