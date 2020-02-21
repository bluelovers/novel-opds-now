import { array_unique, array_unique_overwrite } from 'array-hyper-unique';
import { handleArgvList } from '../util/index';
import Bluebird from 'bluebird';
import fetchIPFS from 'fetch-ipfs';
import fetch from '../fetch';
import hashSum from 'hash-sum';
import { IGunEpubNode } from '../types';

//const server = `https://api-file-server.epub.now.sh/`;
const server = `https://calm-inlet-73656.herokuapp.com`;

export function newURL(siteID: string, novelID: string)
{
	return new URL(`db/file/${siteID}/${hashSum(novelID)}`, server);
}

export function getEpubFileInfo(_siteID: string | string[], _novelID: string | string[])
{
	let { siteID, novelID } = handleArgvList(_siteID, _novelID);

	let timeout = 5 * 1000;

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
				let url = newURL(siteID, novelID);

				console.debug(url.href)

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
	let url = newURL(siteID, novelID);

	let timeout = 5 * 1000;

//	let body = new URLSearchParams();
//
//	Object.entries(data)
//		// @ts-ignore
//		.forEach(([k, v]) => body.set(k, v))
//	;

	//return Bluebird.resolve(body);

	console.debug(url.href);

	return fetch(url.href, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data),
		timeout,
	})
}
