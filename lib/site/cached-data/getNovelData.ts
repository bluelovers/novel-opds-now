import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import { getCacheFilename } from '../../util/index';
import Bluebird from 'bluebird';
import { INovelDataSimple } from './types';
import { ISiteIDs, ISiteIDsPlus } from '../types';
import type { siteID as siteIDOfDemoNovel } from '../demonovel/types';
import { IFilterNovelDataPlus } from '../demonovel/types';

export function getNovelData(siteID: typeof siteIDOfDemoNovel, novelID: string | number): Bluebird<IFilterNovelDataPlus>
export function getNovelData(siteID: string | ISiteIDs | EnumNovelSiteList, novelID: string | number): Bluebird<INovelDataSimple>
export function getNovelData<T extends Record<string, any>>(siteID: string | ISiteIDsPlus | EnumNovelSiteList, novelID: string | number)
{
	return Bluebird.resolve(import(getCacheFilename(`${siteID}/map.json`)))
		.then(data => {
			return data[novelID] as T
		})
		.catch(e => null as null)
}
