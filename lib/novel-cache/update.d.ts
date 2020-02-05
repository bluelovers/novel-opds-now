import { ISiteIDs } from './types';
import Bluebird from 'bluebird';
export declare function updateCacheAll(force?: boolean): Bluebird<void[]>;
export declare function updateCache(siteID: ISiteIDs, map: Record<ISiteIDs, string>, force?: boolean): Promise<void>;
export declare function fetchCache<T>(siteID: ISiteIDs, map: Record<ISiteIDs, string>): Bluebird<T>;
export default updateCacheAll;
