import { ISiteIDs } from '../types';
import { buildCache } from './build';
import Bluebird from 'bluebird';
export declare function loadCacheAll(force: boolean): Bluebird<import("./types").INovelDataSimple[][]>;
export declare function loadCache(siteID: ISiteIDs, force: boolean): ReturnType<typeof buildCache>;
