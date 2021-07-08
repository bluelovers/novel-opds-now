import Bluebird from 'bluebird';
import { IRecordCachedJSONRow } from '@demonovel/cached-data/types';
export declare function updateSegmentCache(force: boolean): Bluebird<IRecordCachedJSONRow>;
export default updateSegmentCache;
