/// <reference types="bluebird" />
import { ISiteIDs } from '../novel-cache/types';
import { OPDSV1 } from 'opds-extra';
export declare function makeOPDSSite(siteID: ISiteIDs): import("bluebird")<OPDSV1.Feed>;
export declare function makeOPDSPortal(): OPDSV1.Feed;
export default makeOPDSPortal;
