import { ISiteIDsPlus } from './types';
import { ITSValueOrArray } from 'ts-type';
export declare function siteNeverExpired(siteID: ITSValueOrArray<string | ISiteIDsPlus>): boolean;
export declare function siteNotExpireCheck(siteIDs: ITSValueOrArray<string | ISiteIDsPlus>, timestamp: number): boolean;
