/// <reference types="bluebird" />
import { IGunEpubNode, IGunEpubData } from '../types';
export declare function getGunEpubFile(_siteID: string | string[], _novelID: string | string[], options: {
    query: {
        debug?: boolean;
        force?: boolean;
    };
}): import("bluebird")<IGunEpubData>;
export declare function getGunEpubFile2(_siteID: string | string[], _novelID: string | string[], options: {
    query: {
        debug?: boolean;
        force?: boolean;
    };
}): import("bluebird")<any>;
export declare function putGunEpubFile(_siteID: string | string[], _novelID: string | string[], gunData: IGunEpubNode, options?: {
    query?: {
        debug?: boolean;
        force?: boolean;
    };
}): void;
