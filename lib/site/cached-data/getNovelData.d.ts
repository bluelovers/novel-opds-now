import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import Bluebird from 'bluebird';
export declare function getNovelData(siteID: string | EnumNovelSiteList, novelID: string | number): Bluebird<{
    uuid: string;
    id: string;
    title: string;
    authors: string[];
    cover: string;
    updated: number;
    content: string;
}>;
