import { siteID as siteIDOfDemoNovel } from './demonovel/types';
import { ISiteIDsPlus } from './types';
import { ITSValueOrArray } from 'ts-type';

export function siteNeverExpired(siteID: ITSValueOrArray<string | ISiteIDsPlus>)
{
	return [siteID].flat()
		.findIndex(v => ['masiro', siteIDOfDemoNovel, 'calibre'].includes(v)) !== -1
}

export function siteNotExpireCheck(siteIDs: ITSValueOrArray<string | ISiteIDsPlus>, timestamp: number)
{
	const day = 86400 * 1000;
	let expire = day * 2;

	for (const siteID of [siteIDs].flat())
	{
		if (/wenku8|dmzj/i.test(siteID))
		{
			expire = day * 30;
		}
	}

	return (Date.now() - timestamp) <= expire
}
