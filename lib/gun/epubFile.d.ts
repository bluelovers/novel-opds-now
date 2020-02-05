import Bluebird from 'bluebird';
import { IGunEpubNode } from '../types';
import { ITSValueOrArray } from 'ts-type';
export declare function makeArrayEntrys(siteID: ITSValueOrArray<string>, novel_id: ITSValueOrArray<string | number>): [string, string][];
export declare function allGunEpubFile(siteID: ITSValueOrArray<string>, novel_id: ITSValueOrArray<string | number>): import("gun/types/chain").IGunChainReference<IGunEpubNode, string, false>[];
export declare function promiseGunEpubFile<T>(siteID: string | string[], novel_id: string | string[]): Promise<T>[];
export declare function nodeGunEpubFile(siteID: string, novel_id: string): import("gun/types/chain").IGunChainReference<IGunEpubNode, string, false>;
export declare function raceGunEpubFile(siteID: string | string[], novel_id: string | string[]): Bluebird<IGunEpubNode>;
