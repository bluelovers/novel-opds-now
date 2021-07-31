import { searchIpfs } from '../../lib/ipfs/use';
import { buildLibraryList } from 'calibre-server/lib/db/buildList';
import { getCalibrePaths } from '../../server/router/calibre/util';
import fetch from '../../lib/fetch';
import { ipfsAddresses } from 'ipfs-util-lib';
import { multiaddrToURL } from 'multiaddr-to-url';
import { LazyURL } from 'lazy-url';
import console from 'debug-color2/logger';
import { sanitizeFilename } from '@lazy-node/sanitize-filename';
import { EnumDataFormat, getFilePath } from 'calibre-db';
import Bluebird from 'bluebird';
import {
	loadDeepEntryListMapFromFile,
	deepEntryListMap,
	enableForceSave,
	enableOverwriteServer, _saveDeepEntryListMapToFile, _saveDeepEntryListMapToServer, appendDeepEntryListMap,
} from '../../lib/ipfs/mfs/deepEntryListMap';
import { toCID } from '@lazy-ipfs/to-cid';
import { CID as MultiformatsCID } from 'multiformats';
import itAll from 'it-all';
import itMap from 'it-map';
import { pathToCid } from 'to-ipfs-url';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';
import { _saveMutableFileSystemRoots, saveMutableFileSystemRoots } from '../../lib/ipfs/mfs/saveMutableFileSystemRoots';

searchIpfs()
	.tap(async ({ ipfs, stop }) =>
	{
		let calibrePaths = getCalibrePaths();
		await loadDeepEntryListMapFromFile();

		let baseURL = await ipfsAddresses(ipfs).then(info => new LazyURL(multiaddrToURL(info.API)));

		baseURL.port = 3000;
		baseURL.pathname = '';

		const dbList = await buildLibraryList({
			calibrePaths,
			cwd: calibrePaths[0],
		});

		let _cacheTask = new Map<string, string>();

		for (const _dbEntry of Object.values(dbList))
		{
			await _dbEntry.lazyload().then(db =>
			{
				console.info(db.name())

				return db.getBooks().catchReturn([] as null).mapSeries(async (book, index, length) =>
				{
					let label = `${(index + 1).toString().padStart(5, '0')}／${length.toString().padStart(5, '0')}`

					let author = book.authors?.[0]?.author_name;

					author = sanitizeFilename(author || 'unknown', {
						replaceToFullWidth: true,
					}) || 'unknown';

					let file = book.data.filter(v => v.data_format === EnumDataFormat.EPUB)[0];

					if (!file)
					{
						console.gray.log(label, `not exists epub`, _dbEntry.id, db.name(), book.book_title, book.book_id, book.book_path);
						return;
					}

					let ext = '.' + file.data_format.toLocaleLowerCase()

					let filename = `${book.book_title} - ${author}${ext}`;

					filename = sanitizeFilename(filename, {
						replaceToFullWidth: true,
					});

					let mfs_path = `/novel-opds-now/calibre/${_dbEntry.id}/${author}/${filename}`;

					let stat = deepEntryListMap.get(mfs_path) || await ipfs.files.stat(mfs_path, {
						hash: true,
					}).then(m => m.cid).catch(e => null as null);

					if (!stat)
					{
						let cid: string;

						console.info(label, `start...`, _dbEntry.id, db.name(), book.book_title, book.book_id, book.book_path);
						await fetch(new LazyURL(`/file/calibre/${_dbEntry.id}/${book.book_id}/${getFilePath(file, book)}`, baseURL))
							.tap(res => {
								let x = res.headers.get('X-Ipfs-Path');

								if (x?.length)
								{
									cid = pathToCid(x);
								}

							})
							.tap(v => console.success(label, `done`, _dbEntry.id, db.name(), book.book_title, book.book_id, book.book_path))
							.catch(console.error)
						;

						_cacheTask.set(mfs_path, cid);

						if ((index % 20) === 0)
						{
							enableForceSave();
							enableOverwriteServer();

							await _saveDeepEntryListMapToFile();

							await saveMutableFileSystemRoots(ipfs);

							console.debug(`delay`, '30s', _cacheTask.size);
							await Bluebird.delay(30 * 1000);
						}

						if (_cacheTask.size >= 200)
						{
							let i = 0;

							for (const [path, cid] of _cacheTask)
							{
								let c2: ICIDValue

								if (cid)
								{
									c2 = toCID(cid)
								}
								else if (deepEntryListMap.has(path))
								{
									c2 = deepEntryListMap.get(path)
								}
								else
								{
									c2 = deepEntryListMap.get(mfs_path) || await ipfs.files.stat(mfs_path, {
										hash: true,
									}).then(m => m.cid).catch(e => null as null);
								}

								if (c2)
								{
									await itAll(ipfs.block.rm(toCID<MultiformatsCID>(c2), {
										force: true,
										//quiet: true,
									}))
										.then(r => console.debug(`ipfs.block.rm`, mfs_path, r))
										.catch(console.error)

									_cacheTask.delete(path);

									i++;
								}

								if (i >= 100)
								{
									//await itAll(ipfs.repo.gc());

									//await ipfs.repo.stat().then(console.log);

									console.yellow.debug(`delay`, '10s', _cacheTask.size);
									await Bluebird.delay(30 * 1000);

									break;
								}
							}
						}
					}
					else
					{
						console.gray.log(label, `skip`, _dbEntry.id, db.name(), book.book_title, book.book_id, book.book_path, stat);

						appendDeepEntryListMap(mfs_path, stat);

						if (0)
						{
							await itAll(ipfs.block.rm(toCID<MultiformatsCID>(stat), {
								force: true,
								//quiet: true,
							}))
								.then(r => console.debug(`ipfs.block.rm`, mfs_path, r))
								.catch(console.error)
						}
					}
				})
			});
		}

		enableForceSave();
		enableOverwriteServer();

		await _saveDeepEntryListMapToFile();

		enableForceSave();
		enableOverwriteServer();

		await _saveDeepEntryListMapToServer();

		enableForceSave();

		await _saveDeepEntryListMapToFile();

		await _saveMutableFileSystemRoots(ipfs)

		return stop();
	})
	.finally(async () => {
		await Bluebird.delay(30 * 1000);

		process.exit();
	})
;
