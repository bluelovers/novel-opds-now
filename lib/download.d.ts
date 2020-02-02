import { EnumNovelSiteList } from 'novel-downloader/src/all';
import Bluebird from 'bluebird';
import { IDownloadInfo } from './types';
export declare function downloadInfo(options: {
    novel_id: string | number;
    siteID: string | EnumNovelSiteList;
    outputRoot: string;
    useCached?: boolean;
}): IDownloadInfo;
export declare function is504<E extends Error>(e: E): boolean;
export declare function downloadNovel2(options: {
    novel_id: string | number;
    siteID: string | EnumNovelSiteList;
    outputRoot: string;
    useCached?: boolean;
}): Bluebird<{
    options: IDownloadInfo;
    download(): Bluebird<{
        cwd: string;
        IDKEY: string;
        novel_id: string;
        novel: import("novel-downloader").NovelSite.INovel;
        epub?: string;
        status?: number;
        removeCallback(): void;
        outputDir: string;
        siteID: string;
        novel_id2: string | number;
        outputRoot: string;
        timestamp: number;
    }>;
}>;
export declare function downloadNovel(novel_id: string | number, siteID: string | EnumNovelSiteList, outputDir?: string): Promise<{
    cwd: string;
    IDKEY: string;
    novel_id: string;
    novel: import("novel-downloader").NovelSite.INovel;
}>;
export default downloadNovel;
