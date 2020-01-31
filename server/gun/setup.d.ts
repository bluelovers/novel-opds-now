import Gun from 'gun';
declare let gun: ReturnType<typeof Gun>;
export declare function setupGun(app: any): ReturnType<typeof Gun>;
export declare function useGun(): ReturnType<typeof Gun>;
export { gun };
export default useGun;
