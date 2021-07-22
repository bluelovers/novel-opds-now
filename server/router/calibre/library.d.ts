import { ISharedHandlerOptions } from 'calibre-server/lib/types';
import { ITSRequiredPick } from 'ts-type/lib/type/record';
export declare function createLibraryHandler(options: ITSRequiredPick<ISharedHandlerOptions, 'dbList' | 'pathWithPrefix' | 'siteTitle'>): import("express-serve-static-core").Router;
