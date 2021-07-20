/**
 * Created by user on 2020/2/1.
 */
import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import { EndpointConfig } from 'ipfs-http-client';
import { IPFS } from 'ipfs-core-types';

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

	timestamp: number,
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
	WAITING_RETRY = 504,
}

export type IGunEpubNode = {
	timestamp: number,
	exists: false,

	filename: never,
	base64: never,

	href?: string,
} | {
	timestamp: number,
	exists: true,

	filename: string,
	/**
	 * 懶得改掉名字
	 */
	base64: Buffer,

	href?: string,
}

export interface IGunEpubData extends Exclude<IGunEpubNode, {
	exists: false,
}>
{
	isGun: boolean,
}

export type IUseIPFSApi = IPFS & {
	getEndpointConfig(): EndpointConfig;
}
