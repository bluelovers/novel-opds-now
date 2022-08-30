import type { siteID as siteIDOfDemoNovel } from './demonovel/types';
export type ISiteIDs = keyof typeof builded_map;
export type ISiteIDsPlus = ISiteIDs | typeof siteIDOfDemoNovel;
export declare const builded_map: {
    dmzj: string;
    esjzone: string;
    masiro: string;
    wenku8: string;
};
export declare const pathPrefix: {
    module: string;
    github: string;
    cache: string;
};
export declare function getLocalFilename(siteID: ISiteIDs, map: Record<ISiteIDs, string>): string;
