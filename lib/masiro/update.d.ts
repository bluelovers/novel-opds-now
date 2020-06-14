import Bluebird from 'bluebird';
import { IRecordCachedJSONRow } from '@demonovel/cached-data/types';
export declare function updateCache(force?: boolean): Bluebird<IRecordCachedJSONRow>;
export declare function updateCache2(force?: boolean): Bluebird<Record<string, number>>;
export default updateCache;
