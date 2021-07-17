import { useIPFS } from './use';
import { toCID } from '@lazy-ipfs/to-cid';
import console from 'debug-color2/logger';
import { StatResult } from 'ipfs-core-types/src/files';
import { IPubSubEpub } from './types';
import { getNovelData } from '../site/cached-data/getNovelData';
import UString from 'uni-string';
import Bluebird from 'bluebird';
import { pokeMutableFileSystem } from './mfs/pokeMutableFileSystem';
import { saveMutableFileSystemRoots } from './mfs/saveMutableFileSystemRoots';
import { isSameCID } from '@lazy-ipfs/is-same-cid';
import { _addMutableFileSystem, waitingCache } from './mfs/_addMutableFileSystem';

export function addMutableFileSystem(options: IPubSubEpub)
{
	return Bluebird.resolve()
		.then(() =>
		{
			const dir_path = `/novel-opds-now/${options.siteID}/${options.novelID}`;
			const file_path = `${dir_path}/${options.data.path}`;

			if (waitingCache.has(file_path))
			{
				return;
			}

			return useIPFS()
				.then(async ({
					ipfs,
					ipfsd,
				}) =>
				{
					//console.debug(`[IPFS]`, `addMutableFileSystem`, dir_path, options)

					await _addMutableFileSystem(dir_path, options.data, { ipfs }, true);

//					if (dir_stat)
//					{
//						let file_stat: StatResult = await ipfs.files.stat(file_path).catch(e => null);
//
//						if (file_stat && file_stat.cid != file_cid)
//						{
//							await ipfs.files.rm(file_path).catch(e => null);
//						}
//
//						if (file_stat?.cid != file_cid)
//						{
//							await ipfs.files.cp(`/ipfs/${file_cid}`, file_path, {
//								parents: true,
//							});
//						}
//					}
//					else
//					{
//						await ipfs.files.mkdir(dir_path, {
//							parents: true,
//						});
//
//						/*
//						dir_stat = await ipfs.files.stat(dir_path);
//
//						const link = new DAGLink(options.data.path, options.data.size, file_cid)
//
//						let patched = await ipfs.object.patch.addLink(dir_stat.cid, link)
//
//						await ipfs.files.rm(dir_path, {
//							recursive: true,
//						});
//						await ipfs.files.cp(`/ipfs/${patched}`, dir_path);
//						 */
//
//						await ipfs.files.cp(`/ipfs/${file_cid}`, file_path, {
//							parents: true,
//						});
//
//					}

					let novel = await getNovelData(options.siteID, options.novelID);

					if (novel?.title)
					{
						let title = UString.slice(novel.title.replace(/[.]+/g, ''), 0, 15).replace(/\//g, '／');

						if (title.length)
						{
							let file_path2 = `${dir_path}/${title}.txt`;
							let file_stat2: StatResult = await ipfs.files.stat(file_path2).catch(e => null);

							if (!file_stat2)
							{
								await ipfs.files.write(file_path2, novel.title, {
									create: true,
								});
							}
						}
					}

					//console.debug(`[IPFS]`, `addMutableFileSystem:root`, `poke`, root_cid)

					await saveMutableFileSystemRoots(ipfs);

					pokeMutableFileSystem(options, novel?.title);

					//console.debug(`[IPFS]`, `addMutableFileSystem:done`, dir_path, dir_stat)
				})
				.catch(e =>
				{
					console.debug(`[IPFS]`, `addMutableFileSystem:error`, options)
					console.trace(e)
				})
				.finally(() => waitingCache.delete(file_path))
		})
}

//let data = {
//	timestamp: 1625538249309,
//	exists: true,
//	filename: 'wenku8_2950.epub',
//}
//
//let object = {
//	cid: 'QmUwUusBdZZCNkYeZiAyiPkcKsHve4xsg6p3UtVUBLDrMS',
//	path: 'wenku8_2950.epub',
//	size: 2192274,
//}
//
//addMutableFileSystem({
//	siteID: 'wenku8',
//	novelID: 2950,
//	data: {
//		...data,
//		...object,
//	},
//})
