export declare function showIP(port: string | number): Promise<void>;
export declare const IP_TESTER_RE: RegExp;
export declare function isLocalHost(url: string): boolean;
export declare function isLocalNetwork(url: string): boolean;
export declare function notAllowCors(url: string): boolean;
export default showIP;
