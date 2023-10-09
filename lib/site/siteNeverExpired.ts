import { siteID as siteIDOfDemoNovel } from './demonovel/types';
import { ISiteIDsPlus } from './types';
import { ITSValueOrArray } from 'ts-type';

export function siteNeverExpired(siteID: ITSValueOrArray<string | ISiteIDsPlus>)
{
	return [siteID].flat()
		.findIndex(v => [
			'masiro',
			siteIDOfDemoNovel,
			'calibre',
			'esjzone',
		].includes(v)) !== -1
}

export function siteNotExpireCheck(siteIDs: ITSValueOrArray<string | ISiteIDsPlus>, timestamp: number)
{
	const day = 86400 * 1000;
	let expire = day * 30 * 2;

	for (const siteID of [siteIDs].flat())
	{
		if (/esjzone/i.test(siteID))
		{
			expire = day * 5;
			break;
		}
	}

	return (Date.now() - timestamp) <= expire
}
