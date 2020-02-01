import { ISiteIDs } from './types';
import Bluebird from 'bluebird';
export declare function loadCache<T>(siteID: ISiteIDs, map: Record<ISiteIDs, string>): Bluebird<T>;
export default loadCache;
