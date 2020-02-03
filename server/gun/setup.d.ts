import Gun from 'gun';
import { Express } from 'express';
declare let gun: ReturnType<typeof Gun>;
export declare function setupGun(app?: Express): ReturnType<typeof Gun>;
export declare function useGun(): ReturnType<typeof Gun>;
export { gun };
export default useGun;
