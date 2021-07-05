/// <reference types="bluebird" />
import { ISiteIDs } from '../site/types';
import { Feed } from 'opds-extra/lib/v1/core';
export declare function makeOPDSShared(feed: Feed, msg?: string): Feed;
export declare function makeOPDSSite(siteID: ISiteIDs): import("bluebird")<any>;
export declare function makeOPDSPortal(): any;
export default makeOPDSPortal;
