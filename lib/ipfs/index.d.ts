import Bluebird from 'bluebird';
import { IGunEpubNode } from '../types';
import { Response } from 'node-fetch';
export declare function newURL(siteID: string, novelID: string, server?: string): URL;
export declare function getEpubFileInfo(_siteID: string | string[], _novelID: string | string[]): Bluebird<IGunEpubNode>;
export declare function putEpubFileInfo(siteID: string, novelID: string, data: IGunEpubNode): Bluebird<Response>;
