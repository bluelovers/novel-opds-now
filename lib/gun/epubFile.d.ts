import Bluebird from 'bluebird';
import { IGunEpubNode } from '../types';
import { ITSValueOrArray } from 'ts-type';
import { IGunChainReference } from 'gun/types/chain';
export declare function makeArrayEntrys(siteID: ITSValueOrArray<string>, novel_id: ITSValueOrArray<string | number>): [string, string][];
export declare function allGunEpubFile(siteID: ITSValueOrArray<string>, novel_id: ITSValueOrArray<string | number>): IGunChainReference<unknown, string, false>[];
export declare function promiseGunEpubFile<T = IGunEpubNode>(siteID: string | string[], novel_id: string | string[]): Promise<T>[];
export declare function nodeGunEpubFile<T = IGunEpubNode>(siteID: string, novel_id: string): IGunChainReference<T, string, false>;
export declare function raceGunEpubFile(siteID: string | string[], novel_id: string | string[]): Bluebird<IGunEpubNode>;
