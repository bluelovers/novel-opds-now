import { IGunEpubData } from '../../types';
import Bluebird from 'bluebird';
export declare function getIPFSEpubFileBoth(siteID: string, novelID: string, options: {
    query?: {
        debug?: boolean;
        force?: boolean;
    };
    href: string;
    filename: string;
    timestamp: number;
}): Bluebird<IGunEpubData>;
