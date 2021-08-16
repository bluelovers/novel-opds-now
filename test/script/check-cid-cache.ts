/**
 * Created by user on 2021/8/16.
 */

import console from 'debug-color2/logger';
import { inspect } from 'util';
import { daemonFactory } from '../../lib/ipfs/util/daemonFactory';
import { unlinkIPFSApiAsync } from 'fix-ipfs/lib/ipfsd-ctl/unlinkIPFSApi';
import { _useIPFS, setIPFSToCache, useIPFSFromCache } from '../../lib/ipfs/use';
import { raceFetchIPFS } from 'fetch-ipfs/race';
import Bluebird from 'bluebird';
import {
	_pokeDeepEntryListMap, _publishDeepEntryListMapToServer,
	_saveDeepEntryListMapToFile, _saveDeepEntryListMapToServer,
	_setDeepEntryListMapBoth, _writeDeepEntryListMapToMfs,
	deepEntryListMap, enableForceSave, enableOverwriteServer,
	loadDeepEntryListMapFromFile, pokeDeepEntryListMap, stringifyDeepEntryListMap,
} from '../../lib/ipfs/mfs/deepEntryListMap';
import { isSameCID } from '@lazy-ipfs/is-same-cid';
import { _saveMutableFileSystemRoots, saveMutableFileSystemRoots } from '../../lib/ipfs/mfs/saveMutableFileSystemRoots';
import { saveJSON } from '@demonovel/local-or-rebuild-file/lib/fs';
import { join } from 'path';
import __root from '../../lib/__root';
import { readJSON, writeFile, writeJSON } from 'fs-extra';
import { publishToIPFSRace } from 'fetch-ipfs/put';
import { filterList } from 'ipfs-server-list';
import { IIPFSFileApiAddReturnEntry } from 'ipfs-types/lib/ipfs/file';

console.enabledColor = true;

inspect.defaultOptions ??= {};
inspect.defaultOptions.colors = console.enabledColor;

(async () => {
	const { ipfs } = await _useIPFS();
	setIPFSToCache(ipfs);

	const peerID = await ipfs.id().then(m => m.id);

	await loadDeepEntryListMapFromFile();

	let _cacheTask: Set<string> = await readJSON(join(__root, 'test/cache/check-cid-cache.json'))
		.catch(ls => ([]))
		.then(ls => new Set<string>(ls))
	;

	let _cacheTaskError: Set<string> = await readJSON(join(__root, 'test/cache/check-cid-cache.error.json'))
		.catch(ls => ([]))
		.then(ls => new Set<string>(ls))
	;

	console.log(_cacheTask.size);

	let index = 0;
	let index_error = 0;
	let index_ok = 0;

	for (let [mfs_path, cid] of deepEntryListMap.entries())
	{
		if (_cacheTaskError.has(mfs_path) || !mfs_path.match(/^\/novel-opds-now\/(?:calibre\/)?[^\\]+\/$|\.cache/) && _cacheTask.has(mfs_path) || (1 && mfs_path.match(/37fbdb/)))
		{
			console.gray.log(`[skip]`, mfs_path);
			continue;
		}

		let cid2 = await ipfs.files.stat(mfs_path, {
			hash: true,
			timeout: 2000,
		}).then(m => m.cid).catch(e => null as null);

		let changed = false;

		if (cid2 && !isSameCID(cid2, cid))
		{
			changed = true;
			_setDeepEntryListMapBoth(mfs_path, cid2);
		}

		let c = console.gray.log.bind(console.gray);

		if (changed)
		{
			c = console.success.bind(console);
			index_ok++;
		}

		if (!cid2)
		{
			c = console.error.bind(console);
			_cacheTaskError.add(mfs_path);
			index_error++;
		}
		else
		{
			_cacheTask.add(mfs_path);
			index_error = 0;
		}

		c(mfs_path, cid2, ++index);

		if (index && (index % 200) === 0 || index_ok && (index_ok % 10) === 0 || index_error && (index_error % 6) === 0)
		{
			enableForceSave();
			enableOverwriteServer();

			await writeJSON(join(__root, 'test/cache/check-cid-cache.json'), [..._cacheTask.values()], {
				spaces: 2,
			});

			await writeJSON(join(__root, 'test/cache/check-cid-cache.error.json'), [..._cacheTaskError.values()], {
				spaces: 2,
			});

			await _saveDeepEntryListMapToFile();

			console.debug(`delay`, '5s', _cacheTask.size);
			await Bluebird.delay(5 * 1000);
		}
	}

	await writeJSON(join(__root, 'test/cache/check-cid-cache.json'), [..._cacheTask.values()], {
		spaces: 2,
	});

	await writeJSON(join(__root, 'test/cache/check-cid-cache.error.json'), [..._cacheTaskError.values()], {
		spaces: 2,
	});

	enableForceSave();
	enableOverwriteServer();

	await _saveDeepEntryListMapToFile();

	await _pokeDeepEntryListMap();

	enableForceSave();
	enableOverwriteServer();

	let { cid, content } = await _publishDeepEntryListMapToServer(ipfs, deepEntryListMap);

	await _pokeDeepEntryListMap(cid, null);

	//await _saveDeepEntryListMapToServer();

	enableForceSave();

	//await _saveDeepEntryListMapToFile();
	await writeFile(join(__root, 'test', 'data', 'novel-opds-now.cids.json'), content);
	await _writeDeepEntryListMapToMfs(content);

	await _saveMutableFileSystemRoots(ipfs)

	await Bluebird.delay(60 * 1000);
})()
	.catch(e => {
		console.error(e)
	})
	.finally(async () => {
		await useIPFSFromCache().then(m => m?.stop?.());

		process.exit();
	});
