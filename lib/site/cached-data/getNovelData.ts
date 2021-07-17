import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import { getCacheFilename } from '../../util/index';
import Bluebird from 'bluebird';
import { INovelDataSimple } from './types';

export function getNovelData(siteID: string | EnumNovelSiteList, novelID: string | number)
{
	return Bluebird.resolve(import(getCacheFilename(`${siteID}/map.json`)))
		.then(data => {
			return data[novelID] as INovelDataSimple
		})
		.catch(e => null as null)
}
