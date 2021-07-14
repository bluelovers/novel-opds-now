import { handleArgvList } from '../util/index';
import { getEpubFileInfo, putEpubFileInfo } from '../ipfs/index';
import Bluebird, { TimeoutError } from 'bluebird';
import checkGunData from '../util/checkData';
import fetchIPFS from 'fetch-ipfs';
import { getIPFS, useIPFS } from '../ipfs/use';
import { IGunEpubData, IGunEpubNode } from '../types';
import console from 'debug-color2/logger';
import { pathToCid, toLink } from 'to-ipfs-url';
import raceFetchIPFS from 'fetch-ipfs/race';
import ipfsServerList, { filterList } from 'ipfs-server-list';
import { lazyRaceServerList } from 'fetch-ipfs/util';
import { publishToIPFSAll, publishToIPFSRace } from 'fetch-ipfs/put';
import { IIPFSFileApi, IFileData, IIPFSFileApiAddOptions, IIPFSFileApiAddReturnEntry } from 'ipfs-types/lib/ipfs/file';
import { inspect } from 'util';
import { EPUB_TOPIC, getPubsubPeers, pubsubPublish, pubsubPublishEpub } from '../ipfs/pubsub';
import { filterPokeAllSettledResult, pokeAll, reportPokeAllSettledResult } from '../ipfs/pokeAll';
import { addMutableFileSystem } from '../ipfs/mfs';
import { fromBuffer } from 'file-type';
import { downloadEpubRace } from './downloadEpubRace';
import { updateCachePubSubPeers } from '../ipfs/pubsub/cache';

export function getIPFSEpubFile(_siteID: string | string[], _novelID: string | string[], options: {
	query: {
		debug?: boolean,
		force?: boolean,
	},
})
{
	let { query = {} as null } = options || {} as null;

	let { siteID, novelID } = handleArgvList(_siteID, _novelID);

	return getEpubFileInfo(siteID, novelID)
		.catch(TimeoutError, e =>
		{
			console.error(`getEpubFileInfo`, String(e));
			return null
		})
		.then(async (data) =>
		{
			console.debug(`驗證緩存檔案...`)
			if (checkGunData(data))
			{
				console.debug(`下載緩存檔案...`, data.href)

				let buf = await downloadEpubRace(data.href)
						.catch(e =>
						{
							console.debug(`下載緩存檔案失敗...`, data.href, String(e))
							return null as null
						})
				;

				if (buf?.length)
				{
					console.debug(`分析緩存檔案...`, data.href)

					data.base64 = buf.toString('base64');

					let { base64, filename, exists, timestamp, href } = data;

					let isGun = false;

					// @ts-ignore
					if (siteID === 'masiro')
					{
						isGun = true;
					}
					else if (query.debug || query.force)
					{

					}
					else if ((Date.now() - data.timestamp) < 86400 * 1000 * 2)
					{
						isGun = true;
					}

					return {
						base64,
						filename,
						exists,
						timestamp,
						isGun,
						href,
					} as IGunEpubData
				}
			}

			return null as null
		})
		.catch(async (e) =>
		{
			try
			{
				let json = await e.json()

				if (json.error !== true)
				{
					console.debug(`getEpubFileInfo`, json);
				}
			}
			catch (e2)
			{
				console.error(`getEpubFileInfo`, e);
			}

			return null as null
		})
		;
}

export async function putIPFSEpubFile(_siteID: string | string[],
	_novelID: string | string[],
	gunData: IGunEpubNode,
	options?: {
		query?: {
			debug?: boolean,
			force?: boolean,
		},
	},
)
{
	({ siteID: _siteID, novelID: _novelID } = handleArgvList(_siteID, _novelID));

	let siteID = _siteID[0];
	let novelID = _novelID[0];

	let { base64, ...data } = gunData;

	let content = Buffer.from(base64, 'base64');

	let { ipfs, path } = await useIPFS().catch(e => ({} as null));

	if (!ipfs)
	{
		console.debug(`[IPFS]`, `local IPFS server is fail`);
		//return null;
	}

	if (!data.href)
	{
		let cid: string;

		console.debug(`[IPFS]`, `add to IPFS`, inspect(data));

		const timeout = 30 * 60 * 1000;

		/**
		 * 試圖推送至其他 IPFS 伺服器來增加檔案存活率與分流
		 */
		await publishToIPFSRace({
			path: data.filename,
			content,
		}, [
			ipfs as any,
			...filterList('API'),
		], {
			addOptions: {
				pin: false,
			},
			timeout,
		})
			.each((settledResult, index) =>
			{

				// @ts-ignore
				let value: IIPFSFileApiAddReturnEntry[] = settledResult.value ?? settledResult.reason?.value;

				if (value?.length)
				{
					const { status } = settledResult;

					value.forEach((result, i) =>
					{
						const resultCID = result.cid.toString();

						if (cid !== resultCID)
						{
							//console.debug(`[${status}]`, inspect(result));
							console.debug(`[IPFS]`, `publishToIPFSAll`, `[${status}]`, cid = resultCID);

							/*
							pubsubPublish(ipfs, {
								cid: resultCID,
								path: result.path,
								size: result.size,
							})
							 */

							ipfs && pubsubPublishEpub(ipfs, {
								siteID,
								novelID,
								data: result,
							}, getPubsubPeers(ipfs));

							ipfs && addMutableFileSystem({
								siteID,
								novelID,
								data: result,
							});

							ipfs && updateCachePubSubPeers(ipfs);

						}
					})
				}
				else
				{
					console.red.dir(settledResult)
				}

			})
			.finally(() => {
				publishToIPFSAll({
					path: data.filename,
					content,
				}, [
					ipfs as any,
					...filterList('API'),
				], {
					addOptions: {
						pin: false,
					},
					timeout,
				}).catch(e => null)
			})
		;

		/*
		for await (const result of ipfs.add({
			path: data.filename,
			content,
		}, {
			pin: false,
		}))
		{
			console.debug(result);
			console.debug(cid = result.cid.toString())
		}
		 */

		if (!cid)
		{
			console.warn(`[IPFS]`, `publishToIPFSAll fail`, `無法將檔案推送至 IPFS，如果發生多次，請檢查 ~/.ipfs , ~/.jsipfs, ${path} 資料夾`);
			return null
		}

		pokeAll(cid, ipfs, data)
			.tap(settledResult =>
			{
				return reportPokeAllSettledResult(settledResult, cid, data.filename)
			})
		;

		data.href = toLink(cid, data.filename);
	}
	else if (!ipfs)
	{
		console.red.debug(`putEpubFileInfo:skip`);
		return null;
	}

	console.success(data.href);
	// @ts-ignore
	delete data.base64;

	await putEpubFileInfo(siteID, novelID, data as any)
		.tap(async (json) =>
		{

			console.debug(`putEpubFileInfo:return`, json);

			let url = new URL(json.data.href);
			let cid = pathToCid(url.pathname);
			let filename = url.searchParams.get('filename');

			/*
			console.debug(`putEpubFileInfo:poke`, {
				url,
				cid,
				filename,
			})
			 */

			pokeAll(cid, {
				filename,
			}).catch(e => null);

			/*
			Bluebird
				.delay(10 * 1000)
				.then(() => {
					return raceFetchIPFS(json.data.href, [
						...lazyRaceServerList(),
						])
					;
				})
				.timeout(60 * 1000)
				.catch(e => null)
			;
			 */

		})
}
