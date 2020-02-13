/// <reference types="node" />
import 'gun-tag';
import type { Express } from 'express';
import type { Server } from 'http';
import type { IGunEpubNode } from '../../lib/types';
declare let gun: ReturnType<typeof setupGun>;
export declare function setupGun(app?: Express | Server): import("gun/types/chain").IGunChainReference<{
    'epub-file': {
        dmzj: Record<string, IGunEpubNode>;
        wenku8: Record<string, IGunEpubNode>;
        esjzone: Record<string, IGunEpubNode>;
        alphapolis: Record<string, IGunEpubNode>;
        hetubook: Record<string, IGunEpubNode>;
        iqing: Record<string, IGunEpubNode>;
        kakuyomu: Record<string, IGunEpubNode>;
        millionbook: Record<string, IGunEpubNode>;
        novelba: Record<string, IGunEpubNode>;
        novelup: Record<string, IGunEpubNode>;
        sfacg: Record<string, IGunEpubNode>;
        syosetu: Record<string, IGunEpubNode>;
        uukanshu: Record<string, IGunEpubNode>;
        webqxs: Record<string, IGunEpubNode>;
        x23qb: Record<string, IGunEpubNode>;
    };
}, any, "pre_root">;
export declare function useGun(): import("gun/types/chain").IGunChainReference<{
    dmzj: Record<string, IGunEpubNode>;
    wenku8: Record<string, IGunEpubNode>;
    esjzone: Record<string, IGunEpubNode>;
    alphapolis: Record<string, IGunEpubNode>;
    hetubook: Record<string, IGunEpubNode>;
    iqing: Record<string, IGunEpubNode>;
    kakuyomu: Record<string, IGunEpubNode>;
    millionbook: Record<string, IGunEpubNode>;
    novelba: Record<string, IGunEpubNode>;
    novelup: Record<string, IGunEpubNode>;
    sfacg: Record<string, IGunEpubNode>;
    syosetu: Record<string, IGunEpubNode>;
    uukanshu: Record<string, IGunEpubNode>;
    webqxs: Record<string, IGunEpubNode>;
    x23qb: Record<string, IGunEpubNode>;
}, "epub-file", "root">;
export declare function useGunRoot(): import("gun/types/chain").IGunChainReference<{
    'epub-file': {
        dmzj: Record<string, IGunEpubNode>;
        wenku8: Record<string, IGunEpubNode>;
        esjzone: Record<string, IGunEpubNode>;
        alphapolis: Record<string, IGunEpubNode>;
        hetubook: Record<string, IGunEpubNode>;
        iqing: Record<string, IGunEpubNode>;
        kakuyomu: Record<string, IGunEpubNode>;
        millionbook: Record<string, IGunEpubNode>;
        novelba: Record<string, IGunEpubNode>;
        novelup: Record<string, IGunEpubNode>;
        sfacg: Record<string, IGunEpubNode>;
        syosetu: Record<string, IGunEpubNode>;
        uukanshu: Record<string, IGunEpubNode>;
        webqxs: Record<string, IGunEpubNode>;
        x23qb: Record<string, IGunEpubNode>;
    };
}, any, "pre_root">;
export { gun };
export default useGun;
