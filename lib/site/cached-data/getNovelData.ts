import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import { getCacheFilename } from '../../util/index';
import Bluebird from 'bluebird';

export function getNovelData(siteID: string | EnumNovelSiteList, novelID: string | number)
{
	return Bluebird.resolve(import(getCacheFilename(`${siteID}/map.json`)))
		.then(data => {
			return data[novelID] as {
				uuid: string;
				id: string;
				title: string;
				authors: string[];
				cover: string;
				updated: number;
				content: string;
			}
		})
		.catch(e => null as null)
}
