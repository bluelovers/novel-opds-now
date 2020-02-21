import Bluebird from 'bluebird';
import { IGunEpubNode } from '../types';
export declare function newURL(siteID: string, novelID: string): URL;
export declare function getEpubFileInfo(_siteID: string | string[], _novelID: string | string[]): Bluebird<IGunEpubNode>;
export declare function putEpubFileInfo(siteID: string, novelID: string, data: IGunEpubNode): Bluebird<import("node-fetch").Response>;
