import { ISiteIDs } from '../types';
import Bluebird from 'bluebird';
import { IRecordCachedJSONRow } from '@demonovel/cached-data/types';
import { INovelDataSimple } from './types';
export declare function updateCache(siteID: ISiteIDs, force: boolean): Bluebird<IRecordCachedJSONRow>;
export declare function buildCache(siteID: ISiteIDs, force: boolean): Bluebird<INovelDataSimple[]>;
