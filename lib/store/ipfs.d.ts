import Bluebird from 'bluebird';
import { IGunEpubData, IGunEpubNode } from '../types';
export declare function getIPFSEpubFile(_siteID: string | string[], _novelID: string | string[], options: {
    query: {
        debug?: boolean;
        force?: boolean;
    };
}): Bluebird<IGunEpubData>;
export declare function putIPFSEpubFile(_siteID: string | string[], _novelID: string | string[], gunData: IGunEpubNode, options?: {
    query?: {
        debug?: boolean;
        force?: boolean;
    };
}): Promise<any>;
