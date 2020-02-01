import Bluebird from 'bluebird';
import { IGunEpubNode } from '../types';
import Gun from 'gun';
import { ITSValueOrArray } from 'ts-type';
export declare function makeArrayEntrys(siteID: ITSValueOrArray<string>, novel_id: ITSValueOrArray<string | number>): [string, string][];
export declare function allGunEpubFile(siteID: ITSValueOrArray<string>, novel_id: ITSValueOrArray<string | number>): ReturnType<typeof Gun>[];
export declare function promiseGunEpubFile<T>(siteID: string | string[], novel_id: string | string[]): Promise<T>[];
export declare function raceGunEpubFile(siteID: string | string[], novel_id: string | string[]): Bluebird<IGunEpubNode>;
