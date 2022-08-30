/// <reference types="node" />
import 'v8-compile-cache';
export declare function startServer(options?: {
    port?: number | string;
    proxy?: string;
    disposable?: boolean;
    calibrePaths?: string[];
}): Promise<import("http").Server>;
export default startServer;
