/// <reference types="bluebird" />
import CID from 'cids';
export declare function addMutableFileSystem(options: {
    siteID: string;
    novelID: string | number;
    data: {
        path: string;
        cid: string | CID;
        size: number;
    };
}): import("bluebird")<void>;
