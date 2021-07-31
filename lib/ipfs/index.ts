import { array_unique, array_unique_overwrite } from 'array-hyper-unique';
import { handleArgvList } from '../util/index';
import Bluebird from 'bluebird';
import fetch from '../fetch';
import hashSum from 'hash-sum';
import { IGunEpubNode } from '../types';
import { RequestInit, RequestInfo, Response, FetchError } from 'node-fetch';
import { putFileRecord } from '@demonovel/db-api';
import { newFileURL } from '@demonovel/db-api/lib/util';

export function getEpubFileInfo(_siteID: string | string[], _novelID: string | string[])
{
	let { siteID, novelID } = handleArgvList(_siteID, _novelID);

	let timeout = 20 * 1000;

	return new Bluebird<IGunEpubNode>((resolve, reject) =>
	{
		let max = siteID.length * novelID.length;
		let i = 0;

		function _resolve(e)
		{
			i++;

			if (e && e.error === false)
			{
				return resolve(e.data)
			}

			if (i >= max)
			{
				return reject(e)
			}
		}

		function _reject(e)
		{
			i++;
			if (i >= max)
			{
				return reject(e)
			}
		}

		siteID.forEach(siteID =>
		{
			novelID.forEach(novelID =>
			{
				let url = newFileURL(siteID, novelID);

				//console.debug(url.href)

				fetch(url.href, {
					timeout,
				})
					.then(v => v.json())
					.then(_resolve)
					.catch(_reject)
				;
			})

		})

	})
		.timeout(timeout + 5 * 1000)
		;
}

export function putEpubFileInfo(siteID: string, novelID: string, data: IGunEpubNode)
{
	return putFileRecord({
		siteID,
		novelID,
		// @ts-ignore
		data,
	})
		.tapCatch(e =>
		{
			console.error(`putEpubFileInfo`, `上傳資料時發生錯誤`, e);
		})
}
