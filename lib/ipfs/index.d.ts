import Bluebird from 'bluebird';
import { IGunEpubNode } from '../types';
export declare const SymSiteID: unique symbol;
export declare const SymNovelID: unique symbol;
export declare function getEpubFileInfo(_siteID: string | string[], _novelID: string | string[]): Bluebird<IGunEpubNode>;
export declare function putEpubFileInfo(siteID: string, novelID: string, data: IGunEpubNode): Bluebird<import("@demonovel/db-api").IFileRecordRow<import("@demonovel/db-api/lib/types").IFileRecordData>>;
