import { handleArgvList } from '../util/index';
import { getEpubFileInfo, putEpubFileInfo } from '../ipfs/index';
import { TimeoutError } from 'bluebird';
import checkGunData from '../gun/checkData';
import fetchIPFS from 'fetch-ipfs';
import useIPFS from 'use-ipfs';
import { IGunEpubData, IGunEpubNode } from '../types';
import console from 'debug-color2/logger';
import { toLink } from 'to-ipfs-url';

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
					.catch(e => console.error(e) as null)
				;

				let buf = await fetchIPFS(data.href, ipfs)
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
					else if ((Date.now() - data.timestamp) < 86400 * 1000)
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
		.catch(e => console.error(e) as null)
	;

	if (!ipfs)
	{
		return null;
	}

	if (!data.href)
	{
		let cid: string;

		console.dir(data);

		console.debug(`add to IPFS`);

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

		data.href = toLink(cid, data.filename);
	}

	console.success(data.href);
	// @ts-ignore
	delete data.base64;

	await putEpubFileInfo(siteID, novelID, data as any)
		.tap(async (v) => console.debug(await v.json()))
		.tapCatch(v => console.error(v))
}
