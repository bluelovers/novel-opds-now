import { useIPFS } from './use';
import { toCID } from '@lazy-ipfs/to-cid';
import { DAGLink } from 'ipld-dag-pb'
import console from 'debug-color2/logger';
import { StatResult } from 'ipfs-core-types/src/files';
import { pokeAll, reportPokeAllSettledResult } from './pokeAll';
import { IPubSubEpub } from './types';
import { getNovelData } from '../site/cached-data/getNovelData';
import UString from 'uni-string';

export function addMutableFileSystem(options: IPubSubEpub)
{
	return useIPFS().then(async ({ ipfs, stop }) =>
	{
		let dir_path = `/novel-opds-now/${options.siteID}/${options.novelID}`;
		let file_path = `${dir_path}/${options.data.path}`;

		//console.debug(`[IPFS]`, `addMutableFileSystem`, dir_path, options)

		let dir_stat: StatResult = await ipfs.files.stat(dir_path).catch(e => null);
		let file_cid = toCID(options.data.cid);

		if (dir_stat)
		{
			let file_stat: StatResult = await ipfs.files.stat(file_path).catch(e => null);

			if (file_stat.cid != file_cid)
			{
				await ipfs.files.rm(file_path).catch(e => null);
				await ipfs.files.cp(`/ipfs/${file_cid}`, file_path);
			}
		}
		else
		{
			await ipfs.files.mkdir(dir_path, {
				parents: true,
			});

			dir_stat = await ipfs.files.stat(dir_path);

			const link = new DAGLink(options.data.path, options.data.size, file_cid)

			let patched = await ipfs.object.patch.addLink(dir_stat.cid, link)

			await ipfs.files.rm(dir_path, {
				recursive: true,
			});
			await ipfs.files.cp(`/ipfs/${patched}`, dir_path);

		}

		let novel = await getNovelData(options.siteID, options.novelID);

		if (novel?.title)
		{
			let title = UString.slice(novel.title.replace(/[.]+/g, ''), 0, 15).replace(/\//g, '／');

			if (title.length)
			{
				let file_path2 = `${dir_path}/${title}`;
				let file_stat2: StatResult = await ipfs.files.stat(file_path).catch(e => null);

				if (!file_stat2)
				{
					await ipfs.files.write(file_path2, '').catch(e => null);
				}
			}
		}

		let root_stat: StatResult = await ipfs.files.stat(`/novel-opds-now/`, {
			hash: true,
		});

		let root_cid = root_stat.cid;
		root_stat = void 0;

		//console.debug(`[IPFS]`, `addMutableFileSystem:root`, `poke`, root_cid)
		pokeAll(`/ipfs/${root_cid}/${options.siteID}/${options.novelID}`, ipfs)
			.tap(async (settledResult) =>
			{
				return reportPokeAllSettledResult(settledResult, root_cid, novel?.title)
			})
		;

		//console.debug(`[IPFS]`, `addMutableFileSystem:done`, dir_path, dir_stat)

		//return stop();
	}).catch(e =>
	{
		console.debug(`[IPFS]`, `addMutableFileSystem:error`, options)
		console.error(e)
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
