import Bluebird from 'bluebird';
import { IGunEpubNode } from '../types';
export declare function getIPFSEpubFile(_siteID: string | string[], _novelID: string | string[], options: {
    query: {
        debug?: boolean;
        force?: boolean;
    };
}): Bluebird<any>;
export declare function putIPFSEpubFile(_siteID: string | string[], _novelID: string | string[], gunData: IGunEpubNode, options?: {
    query?: {
        debug?: boolean;
        force?: boolean;
    };
}): Promise<any>;
