import { ISiteIDs } from '../../novel-cache/types';
import Bluebird from 'bluebird';
import { IRecordCachedJSONRow } from '@demonovel/cached-data/types';
export declare function updateCache(siteID: ISiteIDs): Bluebird<IRecordCachedJSONRow>;
export declare function buildCache(siteID: ISiteIDs): Bluebird<{
    id: string;
    title: string;
    cover: string;
    updated: number;
    content: string;
}[]>;
