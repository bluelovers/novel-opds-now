import { getIPFS, useIPFS } from '../use';
import { IPubSubEpub } from '../types';
import { StatResult } from 'ipfs-core-types/src/files';
import { IUseIPFSApi } from '../../types';
import CID from 'cids';
import { pokeAll, reportPokeAllSettledResult } from '../pokeAll';
import Bluebird from 'bluebird';
import { ITSPromiseSettledResult } from 'ts-type';
import { ITSUnpackedPromiseLike } from 'ts-type/lib/helper/unpacked';
import { array_unique } from 'array-hyper-unique';
import { appendDeepEntryListMap, appendDeepEntryListMapByStatResult } from './deepEntryListMap';

export function pokeMutableFileSystem(options: IPubSubEpub, title: string, ...msg: any[])
{
	return pokeMutableFileSystemCore(title, [
		`${options.siteID}/${options.novelID}/`,
		`${options.siteID}/`,
	], ...msg);
}

export function pokeMutableFileSystemCore(title: string, paths: string[], ...msg: any[])
{
	return getIPFS().then((ipfs) =>
	{
		return Bluebird.mapSeries(array_unique([
			...paths,
			`/`,
		]), (path, index) =>
		{

			//console.debug(`[pokeMutableFileSystem]`, path, title)

			return _pokeMutableFileSystem(ipfs, path, title)
				.tap((arr) =>
				{
					if (index === 0 && arr.length)
					{
						return reportPokeAllSettledResult(arr[arr.length - 1], title, ...msg)
					}
				})
		})
	})
}

export function _pokeMutableFileSystem(ipfs: IUseIPFSApi, path: string, title?: string)
{
	return Bluebird.resolve(ipfs).then(async (ipfs) =>
	{
		let list: string[] = []
		const rootPath = `/novel-opds-now`;

		if (path !== '' && path !== '/')
		{
			let path_stat: StatResult = await ipfs.files.stat(`${rootPath}/${path}`, {
				hash: true,
			});

			list.push(`/ipfs/${path_stat.cid}`);

			appendDeepEntryListMapByStatResult(`${rootPath}/${path}`, path_stat);
		}
		else
		{
			path = '';
		}

		let root_stat: StatResult = await ipfs.files.stat(`${rootPath}/`, {
			hash: true,
		});

		list.push(`/ipfs/${root_stat.cid}/${path}`);

		appendDeepEntryListMapByStatResult(`${rootPath}`, root_stat);

		//console.debug(`[pokeMutableFileSystem]`, list, title);

		return Promise.all(list.map(cid => pokeAll(cid, ipfs, {
			hidden: true,
		})))
	})
}
