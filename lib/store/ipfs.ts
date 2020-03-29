import { handleArgvList } from '../util/index';
import { getEpubFileInfo, putEpubFileInfo } from '../ipfs/index';
import Bluebird, { TimeoutError } from 'bluebird';
import checkGunData from '../gun/checkData';
import fetchIPFS from 'fetch-ipfs';
import useIPFS from 'use-ipfs';
import { IGunEpubData, IGunEpubNode } from '../types';
import console from 'debug-color2/logger';
import { toLink } from 'to-ipfs-url';
import raceFetchIPFS from 'fetch-ipfs/race';
import ipfsServerList, { filterList } from 'ipfs-server-list';
import { lazyRaceServerList } from 'fetch-ipfs/util';
import { publishToIPFSAll, publishToIPFSRace } from 'fetch-ipfs/put';
import { IIPFSFileApi, IFileData, IIPFSFileApiAddOptions, IIPFSFileApiAddReturnEntry } from 'ipfs-types/lib/ipfs/file';
import { processExit } from '../processExit';

export function getIPFSEpubFile(_siteID: string | string[], _novelID: string | string[], options: {
	query: {
		debug?: boolean,
		force?: boolean,
	},
})
{
	let { query = {} } = options || {};

	let { siteID, novelID } = handleArgvList(_siteID, _novelID);

	return getEpubFileInfo(siteID, novelID)
		.catch(TimeoutError, e => null)
		.then(async (data) =>
		{
			if (checkGunData(data))
			{
				let { ipfs } = await useIPFS()
					.then(data => {
						processExit(data.stop)
						return data;
					})
					.catch(e => console.error(e) as null)
				;

				let buf = await raceFetchIPFS(data.href, [
					ipfs,
					...lazyRaceServerList(),
				], 10 * 1000)
					.catch(e => null)
				;

				if (buf && buf.length)
				{
					data.base64 = buf.toString('base64');

					let { base64, filename, exists, timestamp, href } = data;

					let isGun = false;

					if (query.debug || query.force)
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

			return null
		})
		.catch(e => null)
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

	let { ipfs } = await useIPFS()
		.then(data => {
			processExit(data.stop)
			return data;
		})
		.catch(e => console.error(e) as null)
	;

	if (!ipfs)
	{
		console.debug(`local IPFS server is fail`);
		//return null;
	}

	if (!data.href)
	{
		let cid: string;

		console.dir(data);

		console.debug(`add to IPFS`);

		/**
		 * 試圖推送至其他 IPFS 伺服器來增加檔案存活率與分流
		 */
		await publishToIPFSRace({
			path: data.filename,
			content,
		}, [
			ipfs,
			...filterList('API'),
		], {
			addOptions: {
				pin: false,
			},
			timeout: 10 * 1000,
		})
			.tap(settledResult => {
				console.debug(`publishToIPFSAll`, settledResult, {
					depth: 5,
				})
			})
			.each((settledResult, index) => {

				// @ts-ignore
				let value: IIPFSFileApiAddReturnEntry[] = settledResult.value ?? settledResult.reason?.value;

				if (value?.length)
				{
					value.forEach((result, i) => {
						const resultCID = result.cid.toString();

						if (cid !== resultCID)
						{
							console.debug(result);
							console.debug(cid = resultCID);
						}
					})
				}
				else
				{
					console.red.dir(settledResult)
				}

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
			console.warn(`publishToIPFSAll fail`);
			return null
		}

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
		.tap(async (v) => {
			let json = await v.json();

			console.debug(`putEpubFileInfo:return`, json);

			Bluebird
				.delay(5 * 1000)
				.then(() => {
					return raceFetchIPFS(json.data.href, [
						...lazyRaceServerList(),
						])
					;
				})
				.timeout(10 * 1000)
				.catch(e => null)
			;

		})
		.tapCatch(v => console.error(v))
}
