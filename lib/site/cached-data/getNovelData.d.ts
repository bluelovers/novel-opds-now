import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import Bluebird from 'bluebird';
import { INovelDataSimple } from './types';
export declare function getNovelData(siteID: string | EnumNovelSiteList, novelID: string | number): Bluebird<INovelDataSimple>;
