import { siteID as siteIDOfDemoNovel } from './demonovel/types';
import { ISiteIDsPlus } from './types';
import { ITSValueOrArray } from 'ts-type';

export function siteNeverExpired(siteID: ITSValueOrArray<string | ISiteIDsPlus>)
{
	return [siteID].flat()
		.findIndex(v => ['masiro', siteIDOfDemoNovel].includes(v)) !== -1
}
