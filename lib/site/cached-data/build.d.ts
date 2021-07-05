import { ISiteIDs } from '../types';
import Bluebird from 'bluebird';
import { IRecordCachedJSONRow } from '@demonovel/cached-data/types';
export declare function updateCache(siteID: ISiteIDs, force?: boolean): Bluebird<IRecordCachedJSONRow>;
export declare function buildCache(siteID: ISiteIDs, force?: boolean): Bluebird<{
    id: string;
    title: string;
    cover: string;
    updated: number;
    content: string;
}[]>;
