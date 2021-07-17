import { ISiteIDsPlus } from '../types';
import { ITSKeyOfRecordExtractToKey } from 'ts-type/lib/helper/record';
export declare function _buildMap<T extends Record<string, any>>(siteID: ISiteIDsPlus, list: T[], key?: ITSKeyOfRecordExtractToKey<T, string>): Promise<void>;
