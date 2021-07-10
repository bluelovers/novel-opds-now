/// <reference types="node" />
import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import Bluebird from 'bluebird';
export declare function doPackEpubFromSource(siteID: string | EnumNovelSiteList, novelID: string | number): Bluebird<import("cross-spawn-extra").SpawnASyncReturns<Buffer>>;
export declare function _doPackEpubFromSource(siteID: EnumNovelSiteList, novelID: string | number): Bluebird<import("cross-spawn-extra").SpawnASyncReturns<Buffer>>;
