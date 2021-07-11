import { ISiteIDs } from '../types';
import { buildCache } from './build';
import Bluebird from 'bluebird';
export declare function loadCacheAll(force: boolean): Bluebird<{
    uuid: string;
    id: string;
    title: string;
    authors: string[];
    cover: string;
    updated: number;
    content: string;
}[][]>;
export declare function loadCache(siteID: ISiteIDs, force: boolean): ReturnType<typeof buildCache>;
