import Bluebird from 'bluebird';
import { INovelStatCache } from '@node-novel/cache-loader';
export declare function getLocalFilename(file?: string): string;
export declare function loadCache<T = INovelStatCache>(file?: string): Bluebird<T>;
export default loadCache;
