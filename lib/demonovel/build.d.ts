/// <reference types="bluebird" />
import { IOutputFile } from './types';
export declare function buildCache(): import("bluebird")<void[]>;
export declare function buildTitleList(cache: IOutputFile): {
    titles: Record<string, string[]>;
    titles_list: string[];
};
export default buildCache;
