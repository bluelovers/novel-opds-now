/// <reference types="node" />
import 'gun-tag';
import { Express } from 'express';
import { Server } from 'http';
import { IGunEpubNode } from '../../lib/types';
declare let gun: ReturnType<typeof setupGun>;
export declare function setupGun(app?: Express | Server): import("gun/types/chain").IGunChainReference<{
    'epub-file': {
        [x: string]: Record<string, IGunEpubNode>;
    };
}, any, "pre_root">;
export declare function useGun(): import("gun/types/chain").IGunChainReference<{
    [x: string]: Record<string, IGunEpubNode>;
}, "epub-file", "root">;
export declare function useGunRoot(): import("gun/types/chain").IGunChainReference<{
    'epub-file': {
        [x: string]: Record<string, IGunEpubNode>;
    };
}, any, "pre_root">;
export { gun };
export default useGun;
