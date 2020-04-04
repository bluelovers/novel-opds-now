/// <reference types="node" />
import 'gun-tag';
import type { Express } from 'express';
import type { Server } from 'http';
declare let gun: ReturnType<typeof setupGun>;
export declare function setupGun(app?: Express | Server): any;
export declare function useGun(): any;
export declare function useGunRoot(): any;
export { gun };
export default useGun;
