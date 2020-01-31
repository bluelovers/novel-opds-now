/**
 * Created by user on 2020/2/1.
 */
import { EnumNovelSiteList } from 'novel-downloader/src/all';

export type ICacheMap = {
	[siteID in (ICacheMapRow["IDKEY"] & ICacheMapRow["siteID"])]: {
		[novel_id: string]: ICacheMapRow
	}
}

export interface ICacheMapRow
{
	IDKEY: string | 'dmzj';
	siteID: string | EnumNovelSiteList;

	novel_id: string;
	novel_id2: string | number;

	cwd: string;
	outputDir: string;
	outputRoot: string;

	removeCallback?(): void;

	epub: string;
	status: number | EnumCacheMapRowStatus;
}

export interface IDownloadInfo extends Omit<ICacheMapRow, 'epub' | 'status' | 'removeCallback'>
{
	epub?: ICacheMapRow["epub"];
	status?: ICacheMapRow["status"];

	removeCallback(): void;
}

export const enum EnumCacheMapRowStatus
{
	NONE = 0,
	WAITING = 1,
	DONE = 2,
}
