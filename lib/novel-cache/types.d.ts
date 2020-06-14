export declare type ISiteIDs = keyof typeof id_titles_map | keyof typeof builded_map;
export declare const id_titles_map: {
    dmzj: string;
    esjzone: string;
    wenku8: string;
};
export declare const id_update_map: {
    dmzj: string;
    esjzone: string;
    wenku8: string;
};
export declare const id_chapters_map: {
    dmzj: string;
    esjzone: string;
    wenku8: string;
};
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
