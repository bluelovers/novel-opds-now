/**
 * Created by user on 2021/8/16.
 */

import console from 'debug-color2/logger';
import { inspect } from 'util';
import { _useIPFS, setIPFSToCache, useIPFSFromCache } from '../../lib/ipfs/use';
import {
	_pokeDeepEntryListMap,
	_publishDeepEntryListMapToIPFS, _putDeepEntryListMapToServer, _writeDeepEntryListMapToMfs, deepEntryListMap,
	enableForceSave,
	enableOverwriteServer,
	loadDeepEntryListMapFromFile,
} from '../../lib/ipfs/mfs/deepEntryListMap';
import { writeFile } from 'fs-extra';
import { join } from 'path';
import __root from '../../lib/__root';
import { _saveMutableFileSystemRoots } from '../../lib/ipfs/mfs/saveMutableFileSystemRoots';
import Bluebird from 'bluebird';

console.enabledColor = true;

inspect.defaultOptions ??= {};
inspect.defaultOptions.colors = console.enabledColor;

(async () =>
{
	const { ipfs } = await _useIPFS();
	setIPFSToCache(ipfs);

	const peerID = await ipfs.id().then(m => m.id);

	await loadDeepEntryListMapFromFile();

	enableForceSave();
	enableOverwriteServer();

	let { cid, content } = await _publishDeepEntryListMapToIPFS(ipfs, deepEntryListMap);

	console.log(`deepEntryListMap`, cid);

	await Promise.all([
		_putDeepEntryListMapToServer(ipfs, cid).tap(v => console.success(v)),
		_pokeDeepEntryListMap(cid, null),
	]);

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