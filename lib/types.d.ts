import { EnumNovelSiteList } from 'novel-downloader/src/all';
export declare type ICacheMap = {
    [siteID in (ICacheMapRow["IDKEY"] & ICacheMapRow["siteID"])]: {
        [novel_id: string]: ICacheMapRow;
    };
};
export interface ICacheMapRow {
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
    timestamp: number;
}
export interface IDownloadInfo extends Omit<ICacheMapRow, 'epub' | 'status' | 'removeCallback'> {
    epub?: ICacheMapRow["epub"];
    status?: ICacheMapRow["status"];
    removeCallback(): void;
}
export declare const enum EnumCacheMapRowStatus {
    NONE = 0,
    WAITING = 1,
    DONE = 2,
    WAITING_RETRY = 504
}
export declare type IGunEpubNode = {
    timestamp: number;
    exists: false;
} | {
    timestamp: number;
    exists: true;
    filename: string;
    base64: string;
};
export interface IGunEpubData extends Extract<IGunEpubNode, {
    exists: true;
}> {
    isGun: boolean;
}
