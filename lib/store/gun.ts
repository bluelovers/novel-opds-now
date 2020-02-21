import { raceGunEpubFile, nodeGunEpubFile, makeArrayEntrys } from '../gun/epubFile';
import { handleArgvList } from '../util/index';
import checkGunData from '../gun/checkData';
import { IGunEpubNode, IGunEpubData } from '../types';
import console from 'debug-color2/logger';
import { TimeoutError } from 'bluebird';

export function getGunEpubFile(_siteID: string | string[], _novelID: string | string[], options: {
	query: {
		debug?: boolean,
		force?: boolean,
	},
})
{
	let { query = {} } = options || {};

	let { siteID, novelID } = handleArgvList(_siteID, _novelID);

	return raceGunEpubFile(siteID, novelID)
		.then(async (data) =>
		{
			let bool: boolean = checkGunData(data);

			if (!checkGunData(data))
			{
				let { base64, filename, exists, timestamp } = (data || {}) as Exclude<IGunEpubNode, {
					exists: false,
				}>;

				let gun = nodeGunEpubFile<Exclude<IGunEpubNode, {
					exists: false,
				}>>(siteID[0], novelID[0]);

				// @ts-ignore
				timestamp = timestamp || await gun.get('timestamp');

				if (typeof timestamp === 'number')
				{
					// @ts-ignore
					filename = filename || await gun.get('filename');

					if (typeof filename === 'string')
					{
						// @ts-ignore
						base64 = base64 || await gun.get('base64');

						if (typeof base64 === 'string')
						{
							data = {
								base64,
								exists: true,
								filename,
								timestamp,
							}
						}
					}
				}
			}

			if (checkGunData(data))
			{
				let { base64, filename, exists, timestamp } = data;
				let isGun = false;

				console.info(`於P2P緩存發現檔案...`, new Date(timestamp));

				if (query.debug || query.force)
				{
					console.info(`發現強制下載指令，本次將無視緩存`, query)
				}
				else if ((Date.now() - data.timestamp) < 86400 * 1000)
				{
					isGun = true;
				}
				else
				{
					console.warn(`目標檔案已過期，試圖重新建立檔案`)
				}

				return {
					base64,
					filename,
					exists,
					timestamp,
					isGun,
				} as IGunEpubData
			}
			else if (bool === false)
			{
				console.warn(`於P2P緩存發現檔案...`, `但資料似乎已損毀`);
			}
			else
			{
				console.info(`沒有發現P2P緩存...`);
			}

			return null
		})
}

export function getGunEpubFile2(_siteID: string | string[], _novelID: string | string[], options: {
	query: {
		debug?: boolean,
		force?: boolean,
	},
})
{
	let { query = {} } = options || {};
	let { siteID, novelID } = handleArgvList(_siteID, _novelID);

	return raceGunEpubFile(siteID, novelID)
		.then(async (data) =>
		{
			if (checkGunData(data))
			{
				let { base64, filename, exists, timestamp } = data;
				let isGun = true;

				return {
					base64,
					filename,
					exists,
					timestamp,
					isGun,
				} as IGunEpubData
			}
		})
		.timeout(10 * 1000)
		.catch(TimeoutError, e => null)
	;
}

export function putGunEpubFile(_siteID: string | string[], _novelID: string | string[], gunData: IGunEpubNode, options?: {
	query?: {
		debug?: boolean,
		force?: boolean,
	},
})
{
	let { siteID, novelID } = handleArgvList(_siteID, _novelID);

	makeArrayEntrys(siteID, novelID)
		.forEach(([siteID, novel_id]) => nodeGunEpubFile(siteID, novel_id).put(gunData));
}
