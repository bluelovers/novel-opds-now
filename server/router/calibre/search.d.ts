import { ITSPickExtra, ITSRequiredPick } from 'ts-type/lib/type/record';
import { ISharedHandlerOptions } from 'calibre-server/lib/types';
import { Feed } from 'opds-extra/lib/v1';
import Bluebird from 'bluebird';
export declare function calibreSearchFeed(options: ITSPickExtra<ISharedHandlerOptions, 'dbList' | 'pathWithPrefix'>, argv: {
    searchTerms: string;
}): Bluebird<Feed>;
export declare function calibreSearchHandler(options: ITSRequiredPick<ISharedHandlerOptions, 'dbList' | 'pathWithPrefix' | 'siteTitle'>): import("express-serve-static-core").Router;
export default calibreSearchHandler;
