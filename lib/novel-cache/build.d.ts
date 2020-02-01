import { ISiteIDs } from './types';
import Bluebird from 'bluebird';
export declare function buildSortAll(): Bluebird<void[]>;
export declare function buildSort(siteID: ISiteIDs): Bluebird<void>;
export default buildSortAll;
