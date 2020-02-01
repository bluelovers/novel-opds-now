import { ISiteIDs } from './types';
import Bluebird from 'bluebird';
export declare function updateCacheAll(): Bluebird<void[]>;
export declare function updateCache(siteID: ISiteIDs, map: Record<ISiteIDs, string>): Promise<void>;
export declare function fetchCache<T>(siteID: ISiteIDs, map: Record<ISiteIDs, string>): Bluebird<T>;
export default updateCacheAll;
