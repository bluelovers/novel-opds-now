/// <reference types="bluebird" />
import { ISiteIDs } from '../novel-cache/types';
import { OPDSV1 } from 'opds-extra';
export declare function makeOPDSShared(feed: OPDSV1.Feed, msg?: string): OPDSV1.Feed;
export declare function makeOPDSSite(siteID: ISiteIDs): import("bluebird")<any>;
export declare function makeOPDSPortal(): any;
export default makeOPDSPortal;
