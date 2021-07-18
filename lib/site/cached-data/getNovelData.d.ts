import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import Bluebird from 'bluebird';
import { INovelDataSimple } from './types';
import { ISiteIDs } from '../types';
import type { siteID as siteIDOfDemoNovel } from '../demonovel/types';
import { IFilterNovelDataPlus } from '../demonovel/types';
export declare function getNovelData(siteID: typeof siteIDOfDemoNovel, novelID: string | number): Bluebird<IFilterNovelDataPlus>;
export declare function getNovelData(siteID: string | ISiteIDs | EnumNovelSiteList, novelID: string | number): Bluebird<INovelDataSimple>;
