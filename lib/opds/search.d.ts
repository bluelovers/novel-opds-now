import { ISiteIDs } from '../site/types';
import { Feed } from 'opds-extra/lib/v1/core';
export declare function addOpenSearch(feed: Feed, siteID: ISiteIDs | string): Feed;
export declare function filterOPDSBook(feed: Feed, searchTermOptions: {
    searchTerms: string;
    onlyBook?: boolean;
}): Feed;
