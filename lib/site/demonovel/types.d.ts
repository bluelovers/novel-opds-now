import { IFilterNovelData } from '@node-novel/cache-loader';
export interface IOutputFile {
    [title: string]: {
        siteID: string;
        id: string;
    }[];
}
export interface IFilterNovelDataPlus extends IFilterNovelData {
    title: string;
    authors: string[];
    uuid: string;
    id: string;
}
export declare const siteID = "demonovel";
