import { OPDSV1 } from 'opds-extra';
import { ISiteIDs } from '../novel-cache/types';
export declare function addOpenSearch(feed: OPDSV1.Feed, siteID: ISiteIDs | string): OPDSV1.Feed;
export declare function filterOPDSBook(feed: OPDSV1.Feed, searchTermOptions: {
    searchTerms: string;
    onlyBook?: boolean;
}): OPDSV1.Feed;
